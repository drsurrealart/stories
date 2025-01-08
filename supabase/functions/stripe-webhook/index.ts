import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('No stripe signature found');
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log('Received Stripe webhook event:', event.type);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!customer.email) {
          throw new Error('No customer email found');
        }

        // Get the price ID to determine subscription level
        const priceId = subscription.items.data[0].price.id;
        
        // Get subscription tier based on price ID
        const { data: tier, error: tierError } = await supabase
          .from('subscription_tiers')
          .select('level')
          .or(`stripe_price_id.eq.${priceId},stripe_yearly_price_id.eq.${priceId}`)
          .single();

        if (tierError || !tier) {
          console.error('Error finding subscription tier:', tierError);
          throw new Error('Subscription tier not found');
        }

        // Update user's subscription level
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            subscription_level: tier.level,
            updated_at: new Date().toISOString()
          })
          .eq('id', customer.metadata.supabaseUid);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }

        console.log('Successfully updated subscription for user:', customer.email);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);

        // Reset subscription to free tier
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            subscription_level: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('id', customer.metadata.supabaseUid);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }

        console.log('Successfully cancelled subscription for user:', customer.email);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
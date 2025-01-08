import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!endpointSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!customer || customer.deleted) {
          throw new Error('Customer not found');
        }

        // Get the price ID and determine subscription level
        const priceId = subscription.items.data[0].price.id;
        const { data: subscriptionTier } = await supabaseClient
          .from('subscription_tiers')
          .select('level')
          .eq('stripe_price_id', priceId)
          .single();

        if (!subscriptionTier) {
          throw new Error('Subscription tier not found');
        }

        // Update user's subscription level
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ 
            subscription_level: subscriptionTier.level,
            updated_at: new Date().toISOString(),
          })
          .eq('id', (customer as any).metadata.supabase_user_id);

        if (updateError) throw updateError;
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
        
        if (!deletedCustomer || deletedCustomer.deleted) {
          throw new Error('Customer not found');
        }

        // Reset user's subscription to free
        const { error: deleteError } = await supabaseClient
          .from('profiles')
          .update({ 
            subscription_level: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('id', (deletedCustomer as any).metadata.supabase_user_id);

        if (deleteError) throw deleteError;
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});
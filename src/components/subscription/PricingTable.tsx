
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BillingToggle } from "./BillingToggle";
import { PricingCard } from "./PricingCard";
import { Json } from "@/integrations/supabase/types";

interface PricingTier {
  id: string;
  level: 'free' | 'basic' | 'premium' | 'enterprise' | 'credits';
  name: string;
  price: number;
  yearly_price: number;
  description: string;
  monthly_credits: number;
  saved_stories_limit: number;
  features: Json;
  stripe_price_id?: string;
  stripe_yearly_price_id?: string;
}

interface PricingTableProps {
  tiers: PricingTier[];
  currentTier?: string;
}

export const PricingTable = ({ tiers, currentTier }: PricingTableProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();
  
  const handleSubscribe = async (tier: PricingTier) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        return;
      }

      const isOneTimePayment = tier.level === 'credits';
      // For one-time payments, always use stripe_price_id regardless of isYearly
      const priceId = isOneTimePayment 
        ? tier.stripe_price_id 
        : (isYearly ? tier.stripe_yearly_price_id : tier.stripe_price_id);

      console.log('Using price ID:', priceId);

      if (!priceId) {
        toast({
          title: "Configuration error",
          description: "This tier is not available for subscription",
          variant: "destructive",
        });
        return;
      }

      console.log('Calling create-checkout-session with:', { priceId, isYearly, isOneTimePayment });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId, 
          isYearly,
          isOneTimePayment 
        },
      });

      console.log('Response from create-checkout-session:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to start checkout process",
          variant: "destructive",
        });
        return;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error in handleSubscribe:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  // Separate tiers into subscriptions and upgrades
  const subscriptionTiers = tiers.filter(tier => 
    tier.level !== 'credits'
  );
  
  const upgradeTiers = tiers.filter(tier => 
    tier.level === 'credits'
  );

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isYearly={isYearly}
              currentTier={currentTier}
              onSubscribe={() => handleSubscribe(tier)}
            />
          ))}
        </div>
      </div>

      {upgradeTiers.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Available Upgrades</h2>
            <p className="text-muted-foreground mt-2">
              One-time purchases to enhance your story creation experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upgradeTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                isYearly={isYearly}
                currentTier={currentTier}
                onSubscribe={() => handleSubscribe(tier)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

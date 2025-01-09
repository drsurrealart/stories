import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BillingToggle } from "./BillingToggle";
import { PricingCard } from "./PricingCard";
import { Json } from "@/integrations/supabase/types";

interface PricingTier {
  id: string;
  level: 'free' | 'basic' | 'premium' | 'enterprise';
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

      // Get the appropriate price ID based on billing interval
      const priceId = isYearly ? tier.stripe_yearly_price_id : tier.stripe_price_id;
      console.log('Using price ID:', priceId);

      if (!priceId) {
        toast({
          title: "Configuration error",
          description: "This tier is not available for subscription",
          variant: "destructive",
        });
        return;
      }

      console.log('Calling create-checkout-session with:', { priceId, isYearly });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, isYearly },
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

  return (
    <div className="space-y-8">
      <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
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
  );
};
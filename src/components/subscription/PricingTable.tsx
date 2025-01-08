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
  stories_per_month: number;
  saved_stories_limit: number;
  features: Json;
  stripe_price_id?: string;
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

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: isYearly ? tier.stripe_price_id + '_yearly' : tier.stripe_price_id,
          isYearly,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
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
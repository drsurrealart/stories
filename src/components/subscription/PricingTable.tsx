import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
}

export const PricingTable = ({ tiers }: PricingTableProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubscribe = async (tier: PricingTier) => {
    try {
      setIsLoading(true);
      
      if (tier.level === 'free') {
        toast({
          title: "Current Plan",
          description: "You are already on the free plan",
        });
        return;
      }

      const priceId = isYearly ? tier.stripe_price_id : tier.stripe_price_id;
      
      if (!priceId) {
        toast({
          title: "Error",
          description: "This plan is not available for purchase",
          variant: "destructive",
        });
        return;
      }

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        return;
      }

      // Call our create-checkout endpoint
      const response = await fetch('/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          isYearly,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = (tier: PricingTier) => {
    if (isYearly) {
      return Math.round(tier.yearly_price / 12); // Show monthly equivalent
    }
    return tier.price;
  };

  const getBillingText = (tier: PricingTier) => {
    if (isYearly) {
      return (
        <>
          <span className="text-4xl font-bold">${calculatePrice(tier)}</span>
          <span className="text-muted-foreground">/month</span>
          <div className="text-sm text-primary mt-1">
            Billed ${tier.yearly_price} yearly
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">Save 20%</Badge>
          </div>
        </>
      );
    }
    return (
      <>
        <span className="text-4xl font-bold">${tier.price}</span>
        <span className="text-muted-foreground">/month</span>
        <div className="text-sm text-muted-foreground mt-1">
          Billed monthly
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center gap-6 bg-card p-2 rounded-lg shadow-sm max-w-xs mx-auto">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-4 py-2 rounded-md transition-colors ${
            !isYearly
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
            isYearly
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          Yearly
          <Badge className="bg-primary/10 text-primary-foreground">
            Save 20%
          </Badge>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                {getBillingText(tier)}
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{tier.stories_per_month} stories per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Save up to {tier.saved_stories_limit} stories</span>
                </li>
                {tier.features && Array.isArray(tier.features) && tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={tier.level === 'free' ? 'outline' : 'default'}
                onClick={() => handleSubscribe(tier)}
                disabled={isLoading}
              >
                {tier.level === 'free' ? 'Current Plan' : 'Upgrade Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
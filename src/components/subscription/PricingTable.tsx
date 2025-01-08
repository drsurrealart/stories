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
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

interface PricingTier {
  id: string;
  level: 'free' | 'basic' | 'premium' | 'enterprise';
  name: string;
  price: number;
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
  
  const handleSubscribe = async (tier: PricingTier) => {
    // Will implement Stripe integration in the next step
    console.log("Subscribe to:", tier.name, isYearly ? "yearly" : "monthly");
  };

  const getFeaturesList = (features: Json): string[] => {
    if (Array.isArray(features)) {
      return features as string[];
    }
    return [];
  };

  const calculatePrice = (basePrice: number) => {
    if (isYearly) {
      // 20% discount for yearly plans
      const yearlyPrice = (basePrice * 12 * 0.8);
      return Math.round(yearlyPrice / 12); // Show monthly equivalent
    }
    return basePrice;
  };

  const getBillingText = (price: number) => {
    if (isYearly) {
      return (
        <>
          <span className="text-4xl font-bold">${calculatePrice(price)}</span>
          <span className="text-muted-foreground">/month</span>
          <div className="text-sm text-primary">
            Billed ${Math.round(calculatePrice(price) * 12)} yearly (20% off)
          </div>
        </>
      );
    }
    return (
      <>
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-muted-foreground">/month</span>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center gap-4">
        <span className={`text-sm ${!isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <Toggle
          pressed={isYearly}
          onPressedChange={setIsYearly}
          className="data-[state=on]:bg-primary"
        >
          Yearly
        </Toggle>
        <span className={`text-sm ${isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
          Yearly (20% off)
        </span>
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
                {getBillingText(tier.price)}
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
                {getFeaturesList(tier.features).map((feature, index) => (
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
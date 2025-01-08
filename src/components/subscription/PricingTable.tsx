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
import { Badge } from "@/components/ui/badge";

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
          <div className="text-sm text-primary mt-1">
            Billed ${Math.round(calculatePrice(price) * 12)} yearly
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">Save 20%</Badge>
          </div>
        </>
      );
    }
    return (
      <>
        <span className="text-4xl font-bold">${price}</span>
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
          <Badge className="bg-primary/10 text-primary-foreground whitespace-nowrap">
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
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All Story Genres</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All Moral Lessons</span>
                </li>
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
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

interface PricingTier {
  id: string;
  level: 'free' | 'basic' | 'premium' | 'enterprise';
  name: string;
  price: number;
  description: string;
  stories_per_month: number;
  saved_stories_limit: number;
  features: string[];
  stripe_price_id?: string;
}

interface PricingTableProps {
  tiers: PricingTier[];
}

export const PricingTable = ({ tiers }: PricingTableProps) => {
  const handleSubscribe = async (tier: PricingTier) => {
    // Will implement Stripe integration in the next step
    console.log("Subscribe to:", tier.name);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier) => (
        <Card key={tier.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <span className="text-4xl font-bold">${tier.price}</span>
              <span className="text-muted-foreground">/month</span>
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
              {tier.features.map((feature, index) => (
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
  );
};
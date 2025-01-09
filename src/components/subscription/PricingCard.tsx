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
import { Badge } from "@/components/ui/badge";
import { Json } from "@/integrations/supabase/types";

interface PricingCardProps {
  tier: {
    id: string;
    level: string;
    name: string;
    price: number;
    yearly_price: number;
    description: string;
    monthly_credits: number;
    saved_stories_limit: number;
    features: Json;
    stripe_price_id?: string;
    stripe_yearly_price_id?: string;
  };
  isYearly: boolean;
  currentTier?: string;
  onSubscribe: () => void;
}

export const PricingCard = ({ tier, isYearly, currentTier, onSubscribe }: PricingCardProps) => {
  const calculatePrice = () => {
    if (isYearly) {
      return Math.round(tier.yearly_price / 12);
    }
    return tier.price;
  };

  const calculateSavings = () => {
    const monthlyTotal = tier.price * 12;
    const yearlyTotal = tier.yearly_price;
    const savings = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  const renderFeatures = (features: Json) => {
    if (Array.isArray(features)) {
      return features.map((feature, index) => (
        typeof feature === 'string' && (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        )
      ));
    }
    return null;
  };

  const getBillingText = () => {
    if (isYearly) {
      const savingsPercentage = calculateSavings();
      return (
        <>
          <span className="text-4xl font-bold">${calculatePrice()}</span>
          <span className="text-muted-foreground">/month</span>
          <div className="text-sm text-primary mt-1">
            Billed ${tier.yearly_price} yearly
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">Save {savingsPercentage}%</Badge>
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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          {getBillingText()}
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{tier.monthly_credits} AI credits per month</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>Save up to {tier.saved_stories_limit} stories</span>
          </li>
          {renderFeatures(tier.features)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={currentTier === tier.level ? 'outline' : 'default'}
          onClick={onSubscribe}
          disabled={currentTier === tier.level}
        >
          {currentTier === tier.level ? 'Current Plan' : 'Upgrade Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};
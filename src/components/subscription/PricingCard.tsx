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
  const isOneTimePayment = ['lifetime', 'credits'].includes(tier.level);
  const isFree = tier.price === 0;

  const calculatePrice = () => {
    if (isOneTimePayment) {
      return tier.price;
    }
    return isYearly ? tier.yearly_price : tier.price;
  };

  const calculateSavings = () => {
    if (isOneTimePayment || isFree) return null;
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
    if (isOneTimePayment) {
      return (
        <>
          <span className="text-4xl font-bold">${calculatePrice()}</span>
          <span className="text-muted-foreground">/one time</span>
          <div className="text-sm text-muted-foreground mt-1">
            One-time purchase
          </div>
        </>
      );
    }

    if (isFree) {
      return (
        <>
          <span className="text-4xl font-bold">$0</span>
          <span className="text-muted-foreground">/month</span>
          <div className="text-sm text-muted-foreground mt-1">
            Always free
          </div>
        </>
      );
    }

    if (isYearly) {
      const savingsPercentage = calculateSavings();
      const yearlyPrice = calculatePrice();
      const monthlyEquivalent = Math.round(yearlyPrice / 12);
      
      return (
        <>
          <span className="text-4xl font-bold">${monthlyEquivalent}</span>
          <span className="text-muted-foreground">/month</span>
          <div className="text-sm text-primary mt-1">
            Billed ${yearlyPrice} yearly
            {savingsPercentage && savingsPercentage > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                Save {savingsPercentage}%
              </Badge>
            )}
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

  const getButtonText = () => {
    if (currentTier === tier.level) return 'Current Plan';
    if (isOneTimePayment) return 'Purchase Now';
    if (!isFree) return 'Upgrade Now';
    return null;
  };

  const buttonText = getButtonText();

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
        {buttonText && (
          <Button 
            className="w-full" 
            variant={currentTier === tier.level ? 'outline' : 'default'}
            onClick={onSubscribe}
            disabled={currentTier === tier.level}
          >
            {buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
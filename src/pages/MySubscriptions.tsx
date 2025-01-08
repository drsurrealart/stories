import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingTable } from "@/components/subscription/PricingTable";
import { useToast } from "@/hooks/use-toast";

const MySubscriptions = () => {
  const { toast } = useToast();

  const { data: subscriptionTiers, isLoading } = useQuery({
    queryKey: ['subscriptionTiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price');
      
      if (error) {
        toast({
          title: "Error loading subscription tiers",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading subscription options...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <p className="text-center text-muted-foreground mb-12">
        Unlock more stories and features with our premium plans
      </p>
      {subscriptionTiers && <PricingTable tiers={subscriptionTiers} />}
    </div>
  );
};

export default MySubscriptions;
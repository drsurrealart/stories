
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingTable } from "@/components/subscription/PricingTable";
import { useToast } from "@/hooks/use-toast";
import { NavigationBar } from "@/components/NavigationBar";

const Pricing = () => {
  const { toast } = useToast();

  const { data: subscriptionTiers, isLoading } = useQuery({
    queryKey: ['subscriptionTiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .neq('level', 'free')  // Exclude free tier
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
        <p className="text-center text-muted-foreground mb-12">
          Select a subscription plan to begin your storytelling journey
        </p>
        {subscriptionTiers && (
          <PricingTable 
            tiers={subscriptionTiers}
          />
        )}
      </div>
    </div>
  );
};

export default Pricing;

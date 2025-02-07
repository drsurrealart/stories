
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";
import { PricingTable } from "@/components/subscription/PricingTable";
import { SubscriptionDetails } from "@/components/subscription/SubscriptionDetails";
import { useToast } from "@/hooks/use-toast";

const MySubscriptions = () => {
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

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
      
      // Filter out lifetime tiers since they're no longer supported
      return data?.filter(tier => tier.level !== 'lifetime') ?? [];
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Subscription Plans</h1>
        <p className="text-center text-muted-foreground mb-12">
          Choose the perfect plan for your storytelling journey
        </p>
        {subscriptionTiers && (
          <PricingTable 
            tiers={subscriptionTiers} 
            currentTier={profile?.subscription_level} 
          />
        )}
        <div className="mt-12">
          <SubscriptionDetails />
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;

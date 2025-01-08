import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionDetails = () => {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage your subscription",
          variant: "destructive",
        });
        return;
      }

      // Add portal session creation logic here
      toast({
        title: "Coming soon",
        description: "Subscription management will be available soon",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription management",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Current Plan</h3>
            <p className="text-2xl font-bold capitalize">{profile?.subscription_level || 'Free'}</p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <p className="text-muted-foreground">Active</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManageSubscription}>
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
};
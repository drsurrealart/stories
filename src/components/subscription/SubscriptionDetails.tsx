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
import { format } from "date-fns";

export const SubscriptionDetails = () => {
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const { data: stripeData, isLoading: stripeLoading } = useQuery({
    queryKey: ['stripe-subscription'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const response = await fetch('/api/stripe/subscription-details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription details');
      }

      return response.json();
    },
    enabled: !!profile && profile.subscription_level !== 'free',
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

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription management",
        variant: "destructive",
      });
    }
  };

  const isLoading = profileLoading || (profile?.subscription_level !== 'free' && stripeLoading);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Current Plan</h3>
            <p className="text-2xl font-bold capitalize">{profile?.subscription_level || 'Free'}</p>
          </div>

          {stripeData && (
            <>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-muted-foreground capitalize">{stripeData.status}</p>
              </div>

              <div>
                <h3 className="font-medium">Billing Period</h3>
                <p className="text-muted-foreground">
                  {formatDate(stripeData.current_period_start)} - {formatDate(stripeData.current_period_end)}
                </p>
              </div>

              {stripeData.cancel_at_period_end && (
                <div className="rounded-md bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">
                    Your subscription will end on {formatDate(stripeData.current_period_end)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManageSubscription}>
          {profile?.subscription_level === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
        </Button>
      </CardFooter>
    </Card>
  );
};
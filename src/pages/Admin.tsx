import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalUsers: number;
  totalStories: number;
  subscriptionStats: {
    [key: string]: number;
  };
}

export const Admin = () => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalStories: 0,
    subscriptionStats: {},
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total stories count
      const { count: storiesCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });

      // Get subscription stats
      const { data: subscriptionData } = await supabase
        .from('profiles')
        .select('subscription_level');

      const subscriptionStats = subscriptionData?.reduce((acc: any, profile) => {
        const level = profile.subscription_level || 'free';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers: usersCount || 0,
        totalStories: storiesCount || 0,
        subscriptionStats: subscriptionStats || {},
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error fetching stats",
        description: "There was a problem loading the admin dashboard stats.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalStories}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.subscriptionStats).map(([level, count]) => (
                <div key={level} className="flex justify-between">
                  <span className="capitalize">{level}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, BookText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserStatistics {
  total_users: number;
  total_stories: number;
  users_by_subscription: Record<string, number>;
  stories_last_30_days: number;
}

const AdminDashboard = () => {
  // First check if user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      if (error) throw error;
      return isAdmin;
    },
  });

  // Then fetch statistics if user is admin
  const { data: stats, isLoading: isLoadingStats, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles')
        .select(`
          subscription_level,
          stories (
            created_at
          )
        `);
      if (error) throw error;

      // Process the data to create statistics
      const total_users = data.length;
      const total_stories = data.reduce((acc, profile) => 
        acc + (Array.isArray(profile.stories) ? profile.stories.length : 0), 0);
      
      const users_by_subscription = data.reduce((acc, profile) => {
        const level = profile.subscription_level || 'free';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const stories_last_30_days = data.reduce((acc, profile) => {
        if (!Array.isArray(profile.stories)) return acc;
        return acc + profile.stories.filter(story => 
          new Date(story.created_at) >= thirtyDaysAgo
        ).length;
      }, 0);

      return {
        total_users,
        total_stories,
        users_by_subscription,
        stories_last_30_days
      } as UserStatistics;
    },
    enabled: !!isAdmin, // Only run this query if user is admin
  });

  if (isCheckingAdmin) {
    return <div className="container mx-auto p-6">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>;
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          You do not have permission to access the admin dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          Error loading dashboard statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const subscriptionData = stats?.users_by_subscription 
    ? Object.entries(stats.users_by_subscription).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total_users}</div>
            )}
          </CardContent>
        </Card>

        {/* Total Stories Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total_stories}</div>
            )}
          </CardContent>
        </Card>

        {/* Stories Last 30 Days Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stories (30 Days)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.stories_last_30_days}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Users by Subscription Level</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoadingStats ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
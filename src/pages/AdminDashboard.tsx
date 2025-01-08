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
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_statistics');
      if (error) throw error;
      return data as UserStatistics;
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
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
            {isLoading ? (
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
            {isLoading ? (
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
            {isLoading ? (
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
          {isLoading ? (
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
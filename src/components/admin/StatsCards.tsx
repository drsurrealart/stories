import { Users, BookText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  isLoading: boolean;
  stats?: {
    total_users: number;
    total_stories: number;
    stories_last_30_days: number;
  };
}

export const StatsCards = ({ isLoading, stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
  );
};
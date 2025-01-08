import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SubscriptionChartProps {
  isLoading: boolean;
  data: Array<{ name: string; value: number }>;
}

export const SubscriptionChart = ({ isLoading, data }: SubscriptionChartProps) => {
  return (
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
            <BarChart data={data}>
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
  );
};
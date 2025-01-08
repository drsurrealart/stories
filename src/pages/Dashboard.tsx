import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [recentStories, setRecentStories] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentStories();
  }, []);

  const fetchRecentStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentStories(data || []);
    } catch (error) {
      console.error('Error fetching recent stories:', error);
      toast({
        title: "Error",
        description: "Failed to load recent stories",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Stories</CardTitle>
          </CardHeader>
          <CardContent>
            {recentStories.length === 0 ? (
              <p className="text-muted-foreground">No stories created yet.</p>
            ) : (
              <ul className="space-y-4">
                {recentStories.map((story: any) => (
                  <li key={story.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
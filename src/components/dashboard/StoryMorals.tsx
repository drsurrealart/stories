import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";

export function StoryMorals() {
  const { data: recentMorals, isLoading } = useQuery({
    queryKey: ['recent-morals'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('stories')
        .select('title, moral')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Loading size="sm" />;
  }

  if (!recentMorals || recentMorals.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Story Morals</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Here are the moral lessons from your most recent stories:
      </p>
      
      <div className="space-y-4">
        {recentMorals.map((story, index) => (
          <Card key={index} className="bg-secondary p-4">
            <CardContent className="p-0">
              <h3 className="font-medium text-sm mb-2 text-primary">{story.title}</h3>
              <p className="text-story-text">{story.moral}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
}
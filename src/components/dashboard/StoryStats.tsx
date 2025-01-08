import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BookMarked, BookOpen } from "lucide-react";
import { Loader2 } from "lucide-react";

export const StoryStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['story-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      // Get all stories for the user
      const { data: stories, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', session.user.id);
        
      if (error) throw error;
      
      // Get the total count from user_story_counts for the current month
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: storyCount } = await supabase
        .from('user_story_counts')
        .select('stories_generated')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .single();
      
      return {
        // Use the stories_generated count from user_story_counts
        totalStories: storyCount?.stories_generated || 0,
        // Only count stories that have both title and content as saved
        savedStories: stories.filter(story => story.title && story.content).length,
      };
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Your Story Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.totalStories || 0}</p>
            <p className="text-sm text-muted-foreground">Stories Created</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookMarked className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.savedStories || 0}</p>
            <p className="text-sm text-muted-foreground">Stories Saved</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
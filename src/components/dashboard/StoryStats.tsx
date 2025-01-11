import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BookMarked, BookOpen, Languages, Target, Clock, Bookmark, Calendar, LineChart, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

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
      
      // Get the total count from user_story_counts across all months
      const { data: storyCounts, error: countError } = await supabase
        .from('user_story_counts')
        .select('credits_used, month_year')
        .eq('user_id', session.user.id);

      if (countError) throw countError;
      
      // Sum up all credits_used counts
      const totalGenerated = storyCounts?.reduce((sum, record) => 
        sum + (record.credits_used || 0), 0) || 0;

      // Calculate additional statistics
      const languages = new Set(stories
        .filter(story => story.language)
        .map(story => story.language)).size;

      const totalWords = stories.reduce((sum, story) => sum + story.content.length, 0);
      
      const readingLevels = new Set(stories
        .filter(story => story.reading_level)
        .map(story => story.reading_level)).size;
      
      // Calculate most used genre
      const genreCounts = stories.reduce((acc, story) => {
        acc[story.genre] = (acc[story.genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostUsedGenre = Object.entries(genreCounts).reduce((a, b) => 
        (a[1] > b[1] ? a : b), ['None', 0])[0];

      // Calculate total reading time (assuming average reading speed of 200 words per minute)
      const totalReadingMinutes = Math.round((totalWords / 5) / 200);

      // New stats calculations
      const averageStoryLength = Math.round(totalWords / (stories.length || 1));

      // Calculate most active month
      const monthCounts = storyCounts?.reduce((acc, record) => {
        acc[record.month_year] = record.credits_used || 0;
        return acc;
      }, {} as Record<string, number>);

      const mostActiveMonth = Object.entries(monthCounts || {}).reduce((a, b) => 
        (a[1] > b[1] ? a : b), ['None', 0])[0];

      // Calculate stories this month
      const currentMonth = format(new Date(), 'yyyy-MM');
      const storiesThisMonth = storyCounts?.find(record => 
        record.month_year === currentMonth)?.credits_used || 0;

      return {
        totalStories: totalGenerated,
        savedStories: stories.filter(story => story.title && story.content).length,
        uniqueLanguages: languages,
        readingLevels,
        totalReadingTime: totalReadingMinutes,
        mostUsedGenre,
        averageStoryLength,
        mostActiveMonth,
        storiesThisMonth
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
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Your Story Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Languages className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.uniqueLanguages || 0}</p>
            <p className="text-sm text-muted-foreground">Languages Used</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.totalReadingTime || 0}</p>
            <p className="text-sm text-muted-foreground">Total Reading Minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.readingLevels || 0}</p>
            <p className="text-sm text-muted-foreground">Reading Levels</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium capitalize">{stats?.mostUsedGenre}</p>
            <p className="text-sm text-muted-foreground">Favorite Genre</p>
          </div>
        </div>

        {/* New Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <LineChart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.averageStoryLength || 0}</p>
            <p className="text-sm text-muted-foreground">Avg. Story Length</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">{stats?.mostActiveMonth || 'None'}</p>
            <p className="text-sm text-muted-foreground">Most Active Month</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.storiesThisMonth || 0}</p>
            <p className="text-sm text-muted-foreground">Stories This Month</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
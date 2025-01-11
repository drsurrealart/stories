import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { supabase } from "@/integrations/supabase/client";
import { StoryCard } from "@/components/story/StoryCard";
import { Loading } from "@/components/ui/loading";
import { SavedStory } from "@/types/story";
import { useToast } from "@/hooks/use-toast";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    try {
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('story_favorites')
        .select(`
          story_id,
          stories (
            id,
            title,
            content,
            moral,
            created_at,
            age_group,
            genre,
            language,
            tone,
            reading_level,
            length_preference,
            reflection_questions,
            action_steps,
            related_quote,
            discussion_prompts
          )
        `)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      const stories = favoritesData.map(f => f.stories as SavedStory).filter(Boolean);
      setFavorites(stories);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load your favorite stories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDelete = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('story_favorites')
        .delete()
        .eq('story_id', storyId);

      if (error) throw error;

      setFavorites(prev => prev.filter(story => story.id !== storyId));
      toast({
        title: "Success",
        description: "Story removed from favorites",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove story from favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Favorite Stories</h1>
        
        {isLoading ? (
          <Loading text="Loading your favorite stories..." />
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven't saved any stories to your favorites yet.
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((story) => (
              <StoryCard 
                key={story.id}
                story={story}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
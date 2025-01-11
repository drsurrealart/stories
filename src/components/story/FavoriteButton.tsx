import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  storyId: string;
}

export const FavoriteButton = ({ storyId }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('story_favorites')
          .select('id')
          .eq('story_id', storyId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setIsFavorited(!!data);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [storyId]);

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      if (isFavorited) {
        const { error } = await supabase
          .from('story_favorites')
          .delete()
          .eq('story_id', storyId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Story removed from favorites",
        });
      } else {
        const { error } = await supabase
          .from('story_favorites')
          .insert({ story_id: storyId });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Story added to favorites",
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      className={`${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
    </Button>
  );
};
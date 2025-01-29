import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/story/SearchBar";
import { StoryPagination } from "@/components/story/StoryPagination";
import { AudioHeader } from "@/components/audio/AudioHeader";
import { AudioList } from "@/components/audio/AudioList";

const ITEMS_PER_PAGE = 5;

const MyAudio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: audioStories, isLoading } = useQuery({
    queryKey: ['audio-stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data: audioData, error: audioError } = await supabase
        .from('audio_stories')
        .select(`
          *,
          stories:story_id (
            id,
            title,
            content,
            moral,
            age_group,
            genre,
            language,
            tone,
            reading_level,
            length_preference
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (audioError) throw audioError;

      const storiesWithImages = await Promise.all(
        audioData.map(async (audio) => {
          const { data: imageData } = await supabase
            .from('story_images')
            .select('image_url')
            .eq('story_id', audio.story_id)
            .maybeSingle();

          return {
            ...audio,
            image_url: imageData?.image_url
          };
        })
      );

      return storiesWithImages;
    },
  });

  const handleDeleteAudio = async (audioId: string) => {
    try {
      const { error } = await supabase
        .from('audio_stories')
        .delete()
        .eq('id', audioId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['audio-stories'] });
      
      toast({
        title: "Success",
        description: "Audio story deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete audio story",
        variant: "destructive",
      });
    }
  };

  // Filter stories based on search query
  const filteredStories = audioStories?.filter(audio => 
    audio.stories.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audio.stories.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <AudioHeader />
        
        <div className="space-y-6">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearch={setSearchQuery}
          />

          {isLoading ? (
            <Loading text="Loading your audio stories..." />
          ) : (
            <>
              {filteredStories.length > 0 && (
                <StoryPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}

              <AudioList 
                audioStories={paginatedStories}
                onDelete={handleDeleteAudio}
              />

              {filteredStories.length > 0 && (
                <StoryPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAudio;
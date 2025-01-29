import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AudioStory } from "@/components/story/AudioStory";
import { StoryContent } from "@/components/story/StoryContent";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2, Music, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const pastelColors = [
  "bg-[#F2FCE2]", // Soft Green
  "bg-[#FEF7CD]", // Soft Yellow
  "bg-[#FEC6A1]", // Soft Orange
  "bg-[#E5DEFF]", // Soft Purple
  "bg-[#FFDEE2]", // Soft Pink
  "bg-[#FDE1D3]", // Soft Peach
  "bg-[#D3E4FD]", // Soft Blue
  "bg-[#F1F0FB]", // Soft Gray
];

const MyAudio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      return audioData;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Music className="h-8 w-8 text-primary animate-bounce" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              My Audio Stories
            </h1>
            <Headphones className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="text-lg text-muted-foreground">
            Your collection of stories brought to life through the power of voice.
          </p>
        </div>

        {isLoading ? (
          <Loading text="Loading your audio stories..." />
        ) : !audioStories?.length ? (
          <div className="text-center text-gray-500">
            You haven't created any audio stories yet.
          </div>
        ) : (
          <div className="space-y-6">
            {audioStories.map((audio, index) => (
              <Card 
                key={audio.id} 
                className={`p-6 ${pastelColors[index % pastelColors.length]} hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold">{audio.stories.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAudio(audio.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <StoryContent 
                  title={audio.stories.title}
                  content={audio.stories.content}
                  moral={audio.stories.moral}
                  ageGroup={audio.stories.age_group}
                  genre={audio.stories.genre}
                  language={audio.stories.language}
                  tone={audio.stories.tone}
                  readingLevel={audio.stories.reading_level}
                  lengthPreference={audio.stories.length_preference}
                />
                <div className="mt-4">
                  <AudioStory 
                    storyId={audio.stories.id} 
                    storyContent={audio.stories.content}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/your-stories?story=${audio.stories.id}`)}
                    className="w-full"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Story
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAudio;
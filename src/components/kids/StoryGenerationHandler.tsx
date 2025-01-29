import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { StoryActions } from "@/components/story/StoryActions";
import { AudioGenerationForm } from "@/components/story/audio/AudioGenerationForm";
import { AudioPlayer } from "@/components/story/audio/AudioPlayer";
import { Lightbulb, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryGenerationHandlerProps {
  generatedStory: any;
  handleCreateNew: () => void;
}

export function StoryGenerationHandler({ 
  generatedStory,
  handleCreateNew 
}: StoryGenerationHandlerProps) {
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showAudioConfirm, setShowAudioConfirm] = useState(false);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to generate audio",
          variant: "destructive",
        });
        setIsGeneratingAudio(false);
        return;
      }

      const response = await supabase.functions.invoke('generate-audio', {
        body: { 
          storyId: generatedStory.id,
          voice: selectedVoice
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate audio");
      }

      // Refresh the story data to get the new audio URL
      const { data: refreshedStory, error: refreshError } = await supabase
        .from('stories')
        .select(`
          *,
          audio_stories (*)
        `)
        .eq('id', generatedStory.id)
        .single();

      if (refreshError) throw refreshError;
      
      // Update the local story data
      Object.assign(generatedStory, refreshedStory);

      toast({
        title: "Audio generated!",
        description: "Your audio story is ready to play.",
      });
    } catch (error: any) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (!generatedStory) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">{generatedStory.title}</h1>
        <div className="prose max-w-none space-y-4">
          <div className="text-story-text whitespace-pre-line">
            {generatedStory.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          {generatedStory.moral && (
            <Card className="bg-primary/10 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Moral of the Story</h3>
              </div>
              <p className="text-story-text whitespace-pre-line">{generatedStory.moral}</p>
            </Card>
          )}
        </div>
      </Card>

      <Card className="p-6">
        {generatedStory.audio_stories?.[0]?.audio_url ? (
          <AudioPlayer 
            audioUrl={generatedStory.audio_stories[0].audio_url}
            isKidsMode={true}
          />
        ) : (
          <div className="text-center">
            <Button
              size="lg"
              className="w-full max-w-md h-20 text-xl gap-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
            >
              <Headphones className="h-8 w-8" />
              {isGeneratingAudio ? "Creating Audio Story..." : "Create Audio Story"}
            </Button>
          </div>
        )}
      </Card>

      <StoryActions
        onCreateNew={handleCreateNew}
        isKidsMode={true}
      />
    </div>
  );
}

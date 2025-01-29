import { AudioPlayer } from "@/components/story/audio/AudioPlayer";
import { Card } from "@/components/ui/card";
import { AlertCircle, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioCheckStepProps {
  hasAudioStory: boolean;
  audioUrl?: string;
  storyId?: string;
}

export function AudioCheckStep({ hasAudioStory, audioUrl, storyId }: AudioCheckStepProps) {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!storyId) return;

    try {
      setIsGeneratingAudio(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to generate audio",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-audio', {
        body: { 
          storyId: storyId,
          voice: "alloy" // Default voice
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate audio");
      }

      toast({
        title: "Audio generated!",
        description: "Your audio story is ready to play.",
      });

      // Refresh the page to show the new audio
      window.location.reload();

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

  if (!hasAudioStory) {
    return (
      <Card className="p-6 bg-destructive/10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">
              Please generate an audio story first before creating a video.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full max-w-md gap-2"
            onClick={handleGenerateAudio}
            disabled={isGeneratingAudio}
          >
            <Headphones className="h-5 w-5" />
            {isGeneratingAudio ? "Generating Audio..." : "Generate Audio Story"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Review your audio story before proceeding with video generation:
      </p>
      {audioUrl && (
        <Card className="p-6">
          <AudioPlayer audioUrl={audioUrl} />
        </Card>
      )}
    </div>
  );
}
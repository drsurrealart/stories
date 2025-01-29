import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SAMPLE_TEXT = "Hello! I'm a narrator for LearnMorals.com. I can help bring your stories to life with my voice.";

const NARRATORS = [
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'A versatile, neutral voice' },
  { id: 'echo', name: 'Echo', gender: 'male', description: 'A deep, resonant male voice' },
  { id: 'fable', name: 'Fable', gender: 'female', description: 'A warm, engaging female voice' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'A confident, authoritative male voice' },
  { id: 'nova', name: 'Nova', gender: 'female', description: 'A bright, energetic female voice' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'A gentle, soothing female voice' },
];

const MyNarrators = () => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleLogout = async () => {
    // Handle logout logic here
  };

  const playVoiceSample = async (voiceId: string) => {
    try {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.remove();
        setAudioElement(null);
      }

      // Call the text-to-speech edge function using Supabase client
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: SAMPLE_TEXT,
          voice: voiceId,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create and play audio element
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      setAudioElement(audio);
      
      audio.onended = () => {
        setPlayingVoice(null);
        setAudioElement(null);
      };

      audio.play();
      setPlayingVoice(voiceId);
    } catch (error) {
      console.error('Error playing voice sample:', error);
      toast({
        title: "Error",
        description: "Failed to play voice sample. Please try again.",
        variant: "destructive",
      });
      setPlayingVoice(null);
    }
  };

  const stopVoiceSample = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      setAudioElement(null);
      setPlayingVoice(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">My Narrators</h1>
        <p className="text-muted-foreground">
          Listen to our available narrators and choose the perfect voice for your stories.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NARRATORS.map((narrator) => (
            <Card key={narrator.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{narrator.name}</h3>
                <p className="text-sm text-muted-foreground">{narrator.description}</p>
                <p className="text-sm">Gender: {narrator.gender}</p>
              </div>

              <Button
                onClick={() => 
                  playingVoice === narrator.id 
                    ? stopVoiceSample()
                    : playVoiceSample(narrator.id)
                }
                variant="secondary"
                className="w-full"
              >
                {playingVoice === narrator.id ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Sample
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Sample
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNarrators;
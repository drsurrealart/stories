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

      // Check if we have a cached sample
      const { data: voiceSamples } = await supabase
        .from('voice_samples')
        .select('audio_url')
        .eq('voice_id', voiceId)
        .single();

      let audioUrl: string;

      if (voiceSamples?.audio_url) {
        // Use cached audio
        audioUrl = voiceSamples.audio_url;
        console.log('Using cached audio:', audioUrl);
      } else {
        // Generate new audio
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

        // Create blob URL from base64 audio
        const blob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const tempUrl = URL.createObjectURL(blob);

        // Upload to Supabase Storage
        const fileName = `${voiceId}-sample.mp3`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audio-stories')
          .upload(fileName, blob, {
            contentType: 'audio/mp3',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('audio-stories')
          .getPublicUrl(fileName);

        audioUrl = publicUrlData.publicUrl;

        // Save to voice_samples table
        const { error: dbError } = await supabase
          .from('voice_samples')
          .insert({
            voice_id: voiceId,
            audio_url: audioUrl,
          });

        if (dbError) {
          console.error('Error saving voice sample:', dbError);
        }

        // Clean up blob URL
        URL.revokeObjectURL(tempUrl);
      }

      // Play the audio
      const audio = new Audio(audioUrl);
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
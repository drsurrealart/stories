import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Mic, Headphones, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VoicePreferenceSelector } from "@/components/story/audio/VoicePreferenceSelector";

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
  const [selectedVoiceForPreference, setSelectedVoiceForPreference] = useState<string | null>(null);
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
      const { data: voiceSamples, error: sampleError } = await supabase
        .from('voice_samples')
        .select('audio_url')
        .eq('voice_id', voiceId)
        .maybeSingle();

      if (sampleError) {
        console.error('Error fetching voice sample:', sampleError);
        throw sampleError;
      }

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
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <NavigationBar onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Mic className="h-8 w-8 text-primary animate-bounce" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              My Narrators
            </h1>
            <Headphones className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="text-lg text-muted-foreground">
            Choose from our collection of professional narrators to bring your stories to life.
            Each voice has been carefully selected to offer unique characteristics and emotions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NARRATORS.map((narrator) => (
            <Card 
              key={narrator.id} 
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-foreground">{narrator.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{narrator.gender} Voice</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{narrator.description}</p>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => 
                      playingVoice === narrator.id 
                        ? stopVoiceSample()
                        : playVoiceSample(narrator.id)
                    }
                    variant="secondary"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedVoiceForPreference(narrator.id)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog 
        open={selectedVoiceForPreference !== null} 
        onOpenChange={() => setSelectedVoiceForPreference(null)}
      >
        <DialogContent>
          {selectedVoiceForPreference && (
            <VoicePreferenceSelector
              voiceId={selectedVoiceForPreference}
              onClose={() => setSelectedVoiceForPreference(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyNarrators;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Headphones, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AudioStoryProps {
  storyId: string;
  storyContent: string;
}

const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy (Neutral)', gender: 'neutral' },
  { id: 'echo', name: 'Echo (Male)', gender: 'male' },
  { id: 'fable', name: 'Fable (Female)', gender: 'female' },
  { id: 'onyx', name: 'Onyx (Male)', gender: 'male' },
  { id: 'nova', name: 'Nova (Female)', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer (Female)', gender: 'female' },
];

export function AudioStory({ storyId, storyContent }: AudioStoryProps) {
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Fetch existing audio story if any
  const { data: audioStory, isLoading } = useQuery({
    queryKey: ['audio-story', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('audio_stories')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Fetch credit cost
  const { data: creditCost } = useQuery({
    queryKey: ['audio-credits-cost'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('audio_credits_cost')
        .eq('key_name', 'AUDIO_STORY_CREDITS')
        .single();

      if (error) throw error;
      return data.audio_credits_cost;
    },
  });

  const handleCreateAudio = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create audio stories.",
          variant: "destructive",
        });
        return;
      }

      // Generate audio using the edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: storyContent, voice: selectedVoice },
      });

      if (error) {
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Convert base64 to blob URL
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element
      const audio = new Audio(audioUrl);
      setAudioElement(audio);

      // Save to Supabase
      const { error: saveError } = await supabase
        .from('audio_stories')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          audio_url: audioUrl,
          voice_id: selectedVoice,
        });

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Audio story created successfully!",
      });

      setShowConfirmDialog(false);

    } catch (error: any) {
      console.error('Error creating audio:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create audio story. Please try again.",
        variant: "destructive",
      });
      setShowConfirmDialog(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Audio Story</h3>
      </div>

      {!audioStory && !audioElement ? (
        <div className="space-y-4">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            className="w-full" 
            onClick={() => setShowConfirmDialog(true)}
          >
            Create Audio Story
          </Button>

          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create Audio Story</AlertDialogTitle>
                <AlertDialogDescription>
                  This will use {creditCost || 3} AI credits to generate an audio version of your story. 
                  Would you like to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateAudio}>
                  Proceed
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
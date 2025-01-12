import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AudioPlayer } from "./audio/AudioPlayer";
import { AudioGenerationForm } from "./audio/AudioGenerationForm";

interface AudioStoryProps {
  storyId: string;
  storyContent: string;
}

export function AudioStory({ storyId, storyContent }: AudioStoryProps) {
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing audio story if any
  const { data: audioStory } = useQuery({
    queryKey: ['audio-story', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('audio_stories')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // Get the signed URL for the audio file
        const { data: { publicUrl } } = await supabase
          .storage
          .from('audio-stories')
          .getPublicUrl(data.audio_url);
        
        return { ...data, audio_url: publicUrl };
      }
      
      return null;
    },
  });

  const handleCreateAudio = async () => {
    try {
      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create audio stories.",
          variant: "destructive",
        });
        return;
      }

      // Update credits before generating audio
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { error: creditError } = await supabase
        .from('user_story_counts')
        .upsert({
          user_id: session.user.id,
          month_year: currentMonth,
          credits_used: (creditInfo?.creditsUsed || 0) + (creditInfo?.creditCost || 3),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,month_year'
        });

      if (creditError) {
        throw new Error('Failed to update credits');
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

      // Convert base64 to blob
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );

      // Generate a unique filename
      const filename = `${crypto.randomUUID()}.mp3`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('audio-stories')
        .upload(filename, audioBlob);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = await supabase
        .storage
        .from('audio-stories')
        .getPublicUrl(filename);

      // Save to Supabase
      const { error: saveError } = await supabase
        .from('audio_stories')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          audio_url: filename, // Store the filename as reference
          voice_id: selectedVoice,
          credits_used: creditInfo?.creditCost || 3
        });

      if (saveError) throw saveError;

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['audio-story', storyId] });
      queryClient.invalidateQueries({ queryKey: ['audio-credits-info'] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

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
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  // Fetch credit cost and user's current credits
  const { data: creditInfo } = useQuery({
    queryKey: ['audio-credits-info'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [{ data: config }, { data: userCredits }] = await Promise.all([
        supabase
          .from('api_configurations')
          .select('audio_credits_cost')
          .eq('key_name', 'AUDIO_STORY_CREDITS')
          .single(),
        supabase
          .from('user_story_counts')
          .select('credits_used')
          .eq('user_id', session.user.id)
          .eq('month_year', new Date().toISOString().slice(0, 7))
          .single()
      ]);

      return {
        creditCost: config?.audio_credits_cost || 3,
        creditsUsed: userCredits?.credits_used || 0
      };
    },
  });

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Audio Story</h3>
      </div>

      {!audioStory ? (
        <AudioGenerationForm
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={handleCreateAudio}
          creditCost={creditInfo?.creditCost}
        />
      ) : (
        <AudioPlayer audioUrl={audioStory.audio_url} />
      )}
    </Card>
  );
}
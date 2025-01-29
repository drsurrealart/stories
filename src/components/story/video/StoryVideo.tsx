import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoGenerationForm } from "./VideoGenerationForm";
import { VideoPlayer } from "./VideoPlayer";
import { useVideoGeneration } from "./hooks/useVideoGeneration";
import { useVideoQuery } from "./hooks/useVideoQuery";
import { VideoHeader } from "./components/VideoHeader";
import { DeleteVideoButton } from "./components/DeleteVideoButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface StoryVideoProps {
  storyId: string;
  storyContent: string;
}

export function StoryVideo({ storyId, storyContent }: StoryVideoProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { isGenerating, generationStep, handleCreateVideo } = useVideoGeneration(storyId, storyContent);
  const { data: videoData } = useVideoQuery(storyId);

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
        const { data: { publicUrl } } = supabase.storage
          .from('audio-stories')
          .getPublicUrl(data.audio_url);
        
        return { ...data, audio_url: publicUrl };
      }
      
      return null;
    },
  });

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <VideoHeader />

      {!videoData ? (
        <VideoGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={(aspectRatio) => handleCreateVideo(aspectRatio, audioStory?.audio_url)}
          generationStep={generationStep}
          hasAudioStory={!!audioStory}
          audioUrl={audioStory?.audio_url}
          storyId={storyId}
          storyContent={storyContent}
        />
      ) : (
        <>
          <VideoPlayer 
            videoUrl={videoData.video_url}
            storyId={storyId}
          />
          <DeleteVideoButton videoData={videoData} storyId={storyId} />
        </>
      )}
    </Card>
  );
}
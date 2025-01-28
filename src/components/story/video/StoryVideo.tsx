import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Add this import
import { Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoGenerationForm } from "./VideoGenerationForm";
import { VideoPlayer } from "./VideoPlayer";
import { useVideoGeneration } from "./hooks/useVideoGeneration";
import { DeleteMediaDialog } from "../media/DeleteMediaDialog";

interface StoryVideoProps {
  storyId: string;
  storyContent: string;
}

export function StoryVideo({ storyId, storyContent }: StoryVideoProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isGenerating, generationStep, handleCreateVideo } = useVideoGeneration(storyId, storyContent);

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
        const { data: { publicUrl } } = await supabase
          .storage
          .from('audio-stories')
          .getPublicUrl(data.audio_url);
        
        return { ...data, audio_url: publicUrl };
      }
      
      return null;
    },
  });

  const { data: videoData, refetch: refetchVideo } = useQuery({
    queryKey: ['story-video', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('story_videos')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const { data: { publicUrl } } = await supabase
          .storage
          .from('story-videos')
          .getPublicUrl(data.video_url);
        
        return { ...data, video_url: publicUrl };
      }
      
      return null;
    },
  });

  const handleDeleteVideo = async () => {
    try {
      setIsDeleting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (videoData) {
        // Delete from storage
        const { error: storageError } = await supabase
          .storage
          .from('story-videos')
          .remove([videoData.video_url]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase
          .from('story_videos')
          .delete()
          .eq('id', videoData.id);

        if (dbError) throw dbError;

        await refetchVideo();
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Story Video</h3>
      </div>

      {!videoData ? (
        <VideoGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={(aspectRatio) => handleCreateVideo(aspectRatio, audioStory?.audio_url)}
          generationStep={generationStep}
          hasAudioStory={!!audioStory}
          audioUrl={audioStory?.audio_url}
        />
      ) : (
        <>
          <VideoPlayer 
            videoUrl={videoData.video_url}
            storyId={storyId}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="mt-4"
          >
            Delete Video
          </Button>
          <DeleteMediaDialog
            isOpen={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDeleteVideo}
            title="Delete Video"
            description="Are you sure you want to delete this video? This action cannot be undone."
            isDeleting={isDeleting}
          />
        </>
      )}
    </Card>
  );
}
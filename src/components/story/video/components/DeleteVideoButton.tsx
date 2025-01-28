import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteMediaDialog } from "../../media/DeleteMediaDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteVideoButtonProps {
  videoData: {
    id: string;
    video_url: string;
  };
  storyId: string;
}

export const DeleteVideoButton = ({ videoData, storyId }: DeleteVideoButtonProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteVideo = async () => {
    try {
      setIsDeleting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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

      await queryClient.invalidateQueries({ queryKey: ['story-video', storyId] });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
  );
};
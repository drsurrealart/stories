import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteMediaDialog } from "../media/DeleteMediaDialog";

interface VideoControlsProps {
  storyId: string;
  videoUrl: string;
}

export function VideoControls({ storyId, videoUrl }: VideoControlsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      const { data } = supabase.storage.from('story-videos').getPublicUrl(videoUrl);
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = `story-${storyId}-video.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your video is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your video.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const { data } = supabase.storage.from('story-videos').getPublicUrl(videoUrl);
      if (navigator.share) {
        await navigator.share({
          title: 'My Story Video',
          url: data.publicUrl
        });
        
        toast({
          title: "Share success",
          description: "Video shared successfully!",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "There was an error sharing your video.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete from storage
      const fileName = videoUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('story-videos')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('story_videos')
        .delete()
        .eq('story_id', storyId);

      if (dbError) throw dbError;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['story-video', storyId] });

      toast({
        title: "Success",
        description: "Story video deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting story video:", error);
      toast({
        title: "Error",
        description: "Failed to delete story video",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Video
      </Button>

      <DeleteMediaDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Story Video"
        description="Are you sure you want to delete this story video? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
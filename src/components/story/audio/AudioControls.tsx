import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteMediaDialog } from "../media/DeleteMediaDialog";
import { ShareMediaDialog } from "../media/ShareMediaDialog";

interface AudioControlsProps {
  storyId: string;
  audioUrl: string;
}

export function AudioControls({ storyId, audioUrl }: AudioControlsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      const { data } = supabase.storage.from('audio-stories').getPublicUrl(audioUrl);
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = `story-${storyId}-audio.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your audio is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your audio.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete from storage
      const fileName = audioUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('audio-stories')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_stories')
        .delete()
        .eq('story_id', storyId);

      if (dbError) throw dbError;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['audio-story', storyId] });

      toast({
        title: "Success",
        description: "Audio story deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting audio story:", error);
      toast({
        title: "Error",
        description: "Failed to delete audio story",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const { data: publicUrl } = supabase.storage.from('audio-stories').getPublicUrl(audioUrl);

  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download
        </Button>
        <ShareMediaDialog 
          title="Audio Story"
          url={publicUrl.publicUrl}
          type="audio"
        />
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Audio
      </Button>

      <DeleteMediaDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Audio Story"
        description="Are you sure you want to delete this audio story? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteMediaDialog } from "../media/DeleteMediaDialog";

interface ImageControlsProps {
  storyId: string;
  imageUrl: string;
}

export function ImageControls({ storyId, imageUrl }: ImageControlsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `story-${storyId}-image.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your image is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your image.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Story Image',
          url: imageUrl
        });
        
        toast({
          title: "Share success",
          description: "Image shared successfully!",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "There was an error sharing your image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('story_images')
        .delete()
        .eq('story_id', storyId);

      if (dbError) throw dbError;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['story-image-data', storyId] });

      toast({
        title: "Success",
        description: "Story image deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting story image:", error);
      toast({
        title: "Error",
        description: "Failed to delete story image",
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
        Delete Image
      </Button>

      <DeleteMediaDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Story Image"
        description="Are you sure you want to delete this story image? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VideoControlsProps {
  storyId: string;
  videoUrl: string;
}

export function VideoControls({ storyId, videoUrl }: VideoControlsProps) {
  const handleDownload = async () => {
    try {
      const { data } = supabase.storage.from('story-videos').getPublicUrl(videoUrl);
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = `story-${storyId}.mp4`;
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

  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      {navigator.share && (
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}
    </div>
  );
}
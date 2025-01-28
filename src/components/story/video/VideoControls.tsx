import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VideoControlsProps {
  storyId: string;
  videoUrl: string;
}

export function VideoControls({ storyId, videoUrl }: VideoControlsProps) {
  const handleDownload = async () => {
    const { data } = supabase.storage.from('story-videos').getPublicUrl(videoUrl);
    const link = document.createElement('a');
    link.href = data.publicUrl;
    link.download = `story-${storyId}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const { data } = supabase.storage.from('story-videos').getPublicUrl(videoUrl);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Story Video',
          url: data.publicUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
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
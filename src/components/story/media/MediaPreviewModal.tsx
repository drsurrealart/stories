import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/story/audio/AudioPlayer";
import { VideoPlayer } from "@/components/story/video/VideoPlayer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: "audio" | "image" | "video" | "pdf";
  mediaUrl: string;
  aspectRatio?: string;
}

export function MediaPreviewModal({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  aspectRatio = "16:9"
}: MediaPreviewModalProps) {
  const renderContent = () => {
    switch (mediaType) {
      case "audio":
        return <AudioPlayer audioUrl={mediaUrl} />;
      case "image":
        return (
          <AspectRatio ratio={16/9} className="bg-black/5 rounded-lg overflow-hidden">
            <img 
              src={mediaUrl} 
              alt="Story illustration" 
              className="w-full h-full object-contain"
            />
          </AspectRatio>
        );
      case "video":
        return <VideoPlayer videoUrl={mediaUrl} aspectRatio={aspectRatio} storyId="" />;
      case "pdf":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-lg mb-4">Download your PDF story</p>
            <Button 
              onClick={() => window.open(mediaUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
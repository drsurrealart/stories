import { Card } from "@/components/ui/card";
import { VideoControls } from "./VideoControls";

interface VideoPlayerProps {
  videoUrl: string;
  storyId: string;
}

export function VideoPlayer({ videoUrl, storyId }: VideoPlayerProps) {
  return (
    <>
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          poster="/placeholder.svg"
        />
      </div>
      <VideoControls 
        storyId={storyId} 
        videoUrl={videoUrl} 
      />
    </>
  );
}
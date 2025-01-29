import { AspectRatio } from "@/components/ui/aspect-ratio";
import { VideoControls } from "./VideoControls";
import { type VideoAspectRatio } from "./types";

interface VideoPlayerProps {
  videoUrl: string;
  aspectRatio: VideoAspectRatio;
  storyId: string;
}

export function VideoPlayer({ videoUrl, aspectRatio, storyId }: VideoPlayerProps) {
  const aspectRatioValue = aspectRatio === "16:9" ? 16/9 : 9/16;

  return (
    <div className="space-y-4">
      <AspectRatio ratio={aspectRatioValue} className="bg-black rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          poster="/placeholder.svg"
        />
      </AspectRatio>
      <VideoControls 
        videoUrl={videoUrl}
        storyId={storyId}
      />
    </div>
  );
}
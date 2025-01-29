import { AspectRatio } from "@/components/ui/aspect-ratio";
import { VideoControls } from "./VideoControls";

interface VideoPlayerProps {
  videoUrl: string;
  aspectRatio: "square" | "portrait" | "landscape";
}

export function VideoPlayer({ videoUrl, aspectRatio }: VideoPlayerProps) {
  const aspectRatioValue = 
    aspectRatio === "square" ? 1 : 
    aspectRatio === "portrait" ? 9/16 : 
    16/9;

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
      />
    </div>
  );
}
import { Video } from "lucide-react";

export const VideoHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Video className="h-5 w-5 text-primary" />
      <h3 className="font-semibold text-lg">Story Video</h3>
    </div>
  );
};
import { AudioPlayer } from "@/components/story/audio/AudioPlayer";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface AudioCheckStepProps {
  hasAudioStory: boolean;
  audioUrl?: string;
}

export function AudioCheckStep({ hasAudioStory, audioUrl }: AudioCheckStepProps) {
  if (!hasAudioStory) {
    return (
      <Card className="p-6 bg-destructive/10">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">
            Please generate an audio story first before creating a video.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Review your audio story before proceeding with video generation:
      </p>
      {audioUrl && (
        <Card className="p-6">
          <AudioPlayer audioUrl={audioUrl} />
        </Card>
      )}
    </div>
  );
}
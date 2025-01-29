import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Music } from "lucide-react";
import { AudioPlayer } from "../../audio/AudioPlayer";

interface AudioCheckStepProps {
  hasAudioStory: boolean;
  audioUrl?: string;
}

export function AudioCheckStep({ hasAudioStory, audioUrl }: AudioCheckStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Audio Status</h3>
      <div className="flex flex-col gap-4">
        {hasAudioStory ? (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Audio narration ready</span>
            </div>
            {audioUrl && (
              <div className="mt-4">
                <AudioPlayer audioUrl={audioUrl} />
              </div>
            )}
          </>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please generate an audio story first
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
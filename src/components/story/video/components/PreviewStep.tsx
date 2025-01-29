import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Play } from "lucide-react";
import { type VideoAspectRatio } from "../types";

interface PreviewStepProps {
  selectedAspectRatio: VideoAspectRatio | '';
  backgroundImage: string;
  hasAudioStory: boolean;
  imageGenerated: boolean;
  isGenerating: boolean;
  generationStep?: string;
  onGenerate: () => void;
}

export function PreviewStep({
  selectedAspectRatio,
  backgroundImage,
  hasAudioStory,
  imageGenerated,
  isGenerating,
  generationStep,
  onGenerate
}: PreviewStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Final Preview</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>Video Format: {selectedAspectRatio}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>Audio Narration: Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>Background Image: Generated</span>
          </div>
        </div>

        {backgroundImage && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <AspectRatio ratio={selectedAspectRatio === "16:9" ? 16/9 : 9/16}>
              <img 
                src={backgroundImage} 
                alt="Generated background"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>
      <Button 
        className="w-full"
        onClick={onGenerate}
        disabled={!selectedAspectRatio || !hasAudioStory || !imageGenerated || isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{generationStep || "Generating..."}</span>
          </div>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Generate Video
          </>
        )}
      </Button>
    </div>
  );
}
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Image, Loader2 } from "lucide-react";
import { type VideoAspectRatio } from "../types";

interface BackgroundStepProps {
  imageGenerated: boolean;
  isGeneratingImage: boolean;
  selectedAspectRatio: VideoAspectRatio | '';
  backgroundImage: string;
  onGenerateBackground: () => Promise<void>;
}

export function BackgroundStep({
  imageGenerated,
  isGeneratingImage,
  selectedAspectRatio,
  backgroundImage,
  onGenerateBackground
}: BackgroundStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Background Image</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {imageGenerated ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Background image ready</span>
            </div>
          ) : (
            <Button 
              onClick={() => onGenerateBackground()}
              disabled={!selectedAspectRatio || isGeneratingImage}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Background Image</>
              )}
            </Button>
          )}
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
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Steps } from "@/components/ui/steps";
import { useState } from "react";
import { VideoFormatStep } from "./components/VideoFormatStep";
import { AudioCheckStep } from "./components/AudioCheckStep";
import { BackgroundStep } from "./components/BackgroundStep";
import { PreviewStep } from "./components/PreviewStep";
import { type VideoAspectRatio } from "./types";

interface VideoGenerationFormProps {
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: (aspectRatio: VideoAspectRatio) => void;
  creditCost?: number;
  generationStep?: string;
  hasAudioStory: boolean;
  audioUrl?: string;
  storyId?: string;
  storyContent?: string;
}

export function VideoGenerationForm({
  isGenerating,
  showConfirmDialog,
  onConfirmDialogChange,
  onGenerate,
  creditCost = 10,
  generationStep,
  hasAudioStory,
  audioUrl,
  storyId,
  storyContent = "",
}: VideoGenerationFormProps) {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<VideoAspectRatio | ''>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const steps = [
    { title: "Video Format", description: "Choose video dimensions" },
    { title: "Audio Check", description: "Verify audio narration" },
    { title: "Background", description: "Generate background image" },
    { title: "Preview", description: "Review and generate" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VideoFormatStep
            selectedAspectRatio={selectedAspectRatio}
            onAspectRatioChange={(value) => setSelectedAspectRatio(value)}
          />
        );

      case 2:
        return (
          <AudioCheckStep
            hasAudioStory={hasAudioStory}
            audioUrl={audioUrl}
            storyId={storyId}
          />
        );

      case 3:
        return (
          <BackgroundStep
            imageGenerated={imageGenerated}
            isGeneratingImage={isGenerating}
            selectedAspectRatio={selectedAspectRatio}
            backgroundImage={backgroundImage}
            onGenerateBackground={() => {}}
          />
        );

      case 4:
        return (
          <PreviewStep
            selectedAspectRatio={selectedAspectRatio}
            backgroundImage={backgroundImage}
            hasAudioStory={hasAudioStory}
            imageGenerated={imageGenerated}
            isGenerating={isGenerating}
            generationStep={generationStep}
            onGenerate={() => selectedAspectRatio && onGenerate(selectedAspectRatio)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={() => onConfirmDialogChange(true)}
        disabled={isGenerating}
      >
        Create Story Video (Uses {creditCost} Credits)
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={onConfirmDialogChange}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="flex flex-row justify-between items-start">
            <AlertDialogTitle>Generate Story Video</AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onConfirmDialogChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogHeader>

          <div className="py-6">
            <Steps
              steps={steps}
              currentStep={currentStep}
              className="mb-8"
            />

            <div className="mt-8">
              {renderStepContent()}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  currentStep === steps.length ||
                  (currentStep === 1 && !selectedAspectRatio) ||
                  (currentStep === 2 && !hasAudioStory) ||
                  (currentStep === 3 && !imageGenerated)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
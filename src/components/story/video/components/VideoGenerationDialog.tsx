import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Steps } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VideoFormatStep } from "./VideoFormatStep";
import { AudioCheckStep } from "./AudioCheckStep";
import { BackgroundStep } from "./BackgroundStep";
import { PreviewStep } from "./PreviewStep";
import { StepNavigation } from "./StepNavigation";
import { type VideoAspectRatio } from "../types";

interface VideoGenerationDialogProps {
  showDialog: boolean;
  onDialogChange: (show: boolean) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  selectedAspectRatio: VideoAspectRatio | '';
  onAspectRatioChange: (ratio: VideoAspectRatio | '') => void;
  hasAudioStory: boolean;
  audioUrl?: string;
  storyId: string;
  imageGenerated: boolean;
  isGeneratingImage: boolean;
  backgroundImage: string;
  onGenerateBackground: () => Promise<void>;
  isGenerating: boolean;
  generationStep?: string;
  onGenerate: () => void;
}

export function VideoGenerationDialog({
  showDialog,
  onDialogChange,
  currentStep,
  onStepChange,
  selectedAspectRatio,
  onAspectRatioChange,
  hasAudioStory,
  audioUrl,
  storyId,
  imageGenerated,
  isGeneratingImage,
  backgroundImage,
  onGenerateBackground,
  isGenerating,
  generationStep,
  onGenerate,
}: VideoGenerationDialogProps) {
  const steps = [
    { title: "Video Format", description: "Choose video dimensions" },
    { title: "Audio Check", description: "Verify audio narration" },
    { title: "Background", description: "Generate background image" },
    { title: "Preview", description: "Review and generate" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const canProceed = 
    (currentStep === 1 && selectedAspectRatio) ||
    (currentStep === 2 && hasAudioStory) ||
    (currentStep === 3 && imageGenerated) ||
    currentStep === 4;

  return (
    <AlertDialog open={showDialog} onOpenChange={onDialogChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-row justify-between items-start">
          <AlertDialogTitle>Generate Story Video</AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDialogChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>

        <AlertDialogDescription>
          Follow these steps to create a video version of your story.
        </AlertDialogDescription>

        <div className="py-6">
          <Steps
            steps={steps}
            currentStep={currentStep}
            className="mb-8"
          />

          <div className="mt-8">
            {currentStep === 1 && (
              <VideoFormatStep
                selectedAspectRatio={selectedAspectRatio}
                onAspectRatioChange={onAspectRatioChange}
              />
            )}
            {currentStep === 2 && (
              <AudioCheckStep
                hasAudioStory={hasAudioStory}
                audioUrl={audioUrl}
                storyId={storyId}
              />
            )}
            {currentStep === 3 && (
              <BackgroundStep
                imageGenerated={imageGenerated}
                isGeneratingImage={isGeneratingImage}
                selectedAspectRatio={selectedAspectRatio}
                backgroundImage={backgroundImage}
                onGenerateBackground={onGenerateBackground}
              />
            )}
            {currentStep === 4 && (
              <PreviewStep
                selectedAspectRatio={selectedAspectRatio}
                backgroundImage={backgroundImage}
                hasAudioStory={hasAudioStory}
                imageGenerated={imageGenerated}
                isGenerating={isGenerating}
                generationStep={generationStep}
                onGenerate={onGenerate}
              />
            )}
          </div>

          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            canProceed={canProceed}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
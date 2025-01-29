import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Steps } from "@/components/ui/steps";
import { useState } from "react";
import { VideoFormatStep } from "./components/VideoFormatStep";
import { AudioCheckStep } from "./components/AudioCheckStep";
import { BackgroundStep } from "./components/BackgroundStep";
import { PreviewStep } from "./components/PreviewStep";
import { type VideoAspectRatio } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

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

  const handleGenerateBackground = async () => {
    if (!storyId) {
      toast({
        title: "Error",
        description: "Story ID is required to generate background image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingImage(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create story images.",
          variant: "destructive",
        });
        return;
      }

      // Get current month's credits
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .maybeSingle();

      if (creditsError) {
        throw new Error('Failed to check credits');
      }

      // Get image credits cost
      const { data: config, error: configError } = await supabase
        .from('api_configurations')
        .select('image_credits_cost')
        .eq('key_name', 'IMAGE_STORY_CREDITS')
        .maybeSingle();

      if (configError) {
        throw new Error('Failed to get credit cost');
      }

      const creditCost = config?.image_credits_cost || 5;
      const currentCredits = userCredits?.credits_used || 0;

      // Update credits
      const { error: creditError } = await supabase
        .from('user_story_counts')
        .upsert({
          user_id: session.user.id,
          month_year: currentMonth,
          credits_used: currentCredits + creditCost,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,month_year'
        });

      if (creditError) {
        throw new Error('Failed to update credits');
      }

      // Get the stored image prompt or create a default one
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .select('image_prompt')
        .eq('id', storyId)
        .maybeSingle();

      if (storyError) {
        throw new Error('Failed to fetch story details');
      }

      const basePrompt = story?.image_prompt || `Create a storybook illustration for this story: ${storyContent}`;
      const enhancedPrompt = `Create a high-quality, detailed illustration suitable for a children's storybook. Style: Use vibrant colors and a mix of 3D rendering and artistic illustration techniques. The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Specific scene: ${basePrompt}. Important: Do not include any text or words in the image.`;

      // Generate image using the edge function
      const { data, error: genError } = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: enhancedPrompt },
      });

      if (genError) throw genError;

      setBackgroundImage(data.imageUrl);
      setImageGenerated(true);

      toast({
        title: "Success",
        description: "Background image generated successfully!",
      });

    } catch (error: any) {
      console.error('Error generating background:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate background image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
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
            isGeneratingImage={isGeneratingImage}
            selectedAspectRatio={selectedAspectRatio}
            backgroundImage={backgroundImage}
            onGenerateBackground={handleGenerateBackground}
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
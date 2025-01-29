import { useState } from "react";
import { Loader2, Play, AlertTriangle, CheckCircle2, Music, Image } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Steps } from "@/components/ui/steps";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type VideoAspectRatio = "16:9" | "9:16";

interface VideoGenerationFormProps {
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: (aspectRatio: VideoAspectRatio) => void;
  creditCost?: number;
  generationStep?: string;
  hasAudioStory: boolean;
  audioUrl?: string;
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
    setIsGeneratingImage(true);
    try {
      // Call the Supabase Edge Function to generate the image
      const { data, error } = await supabase.functions.invoke('generate-story-image', {
        body: {
          prompt: `Create a background image for a story about: ${storyContent.slice(0, 200)}...`,
          aspectRatio: selectedAspectRatio
        },
      });

      if (error) throw error;
      
      if (!data?.imageUrl) {
        throw new Error('No image URL received');
      }

      setBackgroundImage(data.imageUrl);
      setImageGenerated(true);
      
      toast({
        title: "Success",
        description: "Background image generated successfully!",
      });
    } catch (error) {
      console.error('Error generating background:', error);
      toast({
        title: "Error",
        description: "Failed to generate background image. Please try again.",
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Video Format</h3>
            <Select 
              value={selectedAspectRatio} 
              onValueChange={(value: VideoAspectRatio) => setSelectedAspectRatio(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">
                  <div className="flex flex-col">
                    <span>Landscape (16:9)</span>
                    <span className="text-sm text-muted-foreground">Best for YouTube, Desktop</span>
                  </div>
                </SelectItem>
                <SelectItem value="9:16">
                  <div className="flex flex-col">
                    <span>Portrait (9:16)</span>
                    <span className="text-sm text-muted-foreground">Best for Stories, TikTok</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Audio Status</h3>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              {hasAudioStory ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Audio narration ready</span>
                </div>
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

      case 3:
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
                    onClick={handleGenerateBackground}
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

      case 4:
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
              onClick={() => selectedAspectRatio && onGenerate(selectedAspectRatio)}
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
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Story Video</AlertDialogTitle>
            <AlertDialogDescription>
              Follow these steps to create your video
            </AlertDialogDescription>
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
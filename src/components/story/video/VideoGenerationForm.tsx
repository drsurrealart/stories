import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoGenerationDialog } from "./components/VideoGenerationDialog";
import { generateBackgroundImage } from "./services/videoGenerationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  storyId: string;
  storyContent: string;
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
  storyContent,
}: VideoGenerationFormProps) {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<VideoAspectRatio | ''>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const handleGenerateBackground = async () => {
    try {
      setIsGeneratingImage(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const imageUrl = await generateBackgroundImage(
        storyId,
        storyContent,
        selectedAspectRatio,
        session
      );

      if (imageUrl) {
        setBackgroundImage(imageUrl);
        setImageGenerated(true);
        toast({
          title: "Success",
          description: "Background image generated successfully!",
        });
      }
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

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={() => onConfirmDialogChange(true)}
        disabled={isGenerating}
      >
        Create Story Video (Uses {creditCost} Credits)
      </Button>

      <VideoGenerationDialog
        showDialog={showConfirmDialog}
        onDialogChange={onConfirmDialogChange}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        selectedAspectRatio={selectedAspectRatio}
        onAspectRatioChange={setSelectedAspectRatio}
        hasAudioStory={hasAudioStory}
        audioUrl={audioUrl}
        storyId={storyId}
        imageGenerated={imageGenerated}
        isGeneratingImage={isGeneratingImage}
        backgroundImage={backgroundImage}
        onGenerateBackground={handleGenerateBackground}
        isGenerating={isGenerating}
        generationStep={generationStep}
        onGenerate={() => selectedAspectRatio && onGenerate(selectedAspectRatio)}
      />
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoGenerationDialog } from "./components/VideoGenerationDialog";
import { generateBackgroundImage } from "./services/videoGenerationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type VideoAspectRatio } from "./types";
import { useQuery } from "@tanstack/react-query";

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
  const [processingStep, setProcessingStep] = useState<string>('');
  const { toast } = useToast();

  // Query to fetch existing video data
  const { data: existingVideo } = useQuery({
    queryKey: ['video-background', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // First check if there's a video entry with a background image
      const { data: videoData } = await supabase
        .from('story_videos')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (videoData?.video_url) {
        setBackgroundImage(videoData.video_url);
        setImageGenerated(true);
        return videoData;
      }

      return null;
    },
  });

  const handleGenerateBackground = async () => {
    try {
      setIsGeneratingImage(true);
      setProcessingStep('Generating background image...');
      const { data: { session } } = await supabase.auth.getSession();
      
      const imageUrl = await generateBackgroundImage(
        storyId,
        storyContent,
        selectedAspectRatio,
        session
      );

      if (imageUrl) {
        // Save the generated image URL to the story_videos table
        const { error: saveError } = await supabase
          .from('story_videos')
          .upsert({
            story_id: storyId,
            user_id: session?.user.id,
            video_url: imageUrl,
            aspect_ratio: selectedAspectRatio,
            credits_used: 10
          });

        if (saveError) throw saveError;

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
      setProcessingStep('');
    }
  };

  const handleVideoGeneration = async () => {
    if (!selectedAspectRatio) return;
    
    try {
      setProcessingStep('Initializing video generation...');
      await onGenerate(selectedAspectRatio);
    } catch (error) {
      console.error('Error generating video:', error);
      setProcessingStep('');
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
        generationStep={processingStep || generationStep}
        onGenerate={handleVideoGeneration}
      />
    </div>
  );
}
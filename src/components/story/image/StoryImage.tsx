import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ImageGenerationForm } from "./ImageGenerationForm";
import { ImageControls } from "./ImageControls";

interface StoryImageProps {
  storyId: string;
  storyContent: string;
}

export function StoryImage({ storyId, storyContent }: StoryImageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const { data: imageData, isLoading } = useQuery({
    queryKey: ['story-image', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('story_images')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .single();

      return data;
    },
  });

  const generateImage = async (style: string) => {
    try {
      setIsGenerating(true);
      setShowConfirmDialog(false);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please sign in to generate images");
      }

      // Generate image using the edge function
      const response = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: storyContent, style }
      });

      if (response.error) throw response.error;

      // Save image URL to database
      const { error: saveError } = await supabase
        .from('story_images')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          image_url: response.data.imageUrl,
        });

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Story image generated successfully",
      });

      // Refresh the image data
      window.location.reload();
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Story Image</h3>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : imageData ? (
        <div className="space-y-4">
          <img
            src={imageData.image_url}
            alt="Story illustration"
            className="w-full rounded-lg"
          />
          <ImageControls
            storyId={storyId}
            imageUrl={imageData.image_url}
          />
        </div>
      ) : (
        <ImageGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={generateImage}
        />
      )}
    </Card>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ImageGenerationForm } from "./ImageGenerationForm";
import { ImageControls } from "./ImageControls";
import { Loading } from "@/components/ui/loading";

interface StoryImageProps {
  storyId: string;
  storyContent: string;
}

export function StoryImage({ storyId, storyContent }: StoryImageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const { data: imageData, isLoading, error, refetch } = useQuery({
    queryKey: ['story-image', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('story_images')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error("Error fetching story image:", error);
        throw error;
      }

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

      // Generate images using the edge function
      const response = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: storyContent, style }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Story images generated successfully",
      });

      // Refresh the image data
      refetch();
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

  if (error) {
    console.error("Error loading story image:", error);
    toast({
      title: "Error",
      description: "Failed to load story image",
      variant: "destructive",
    });
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Story Image</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Story Image</h3>
      
      {imageData && imageData.length > 0 ? (
        <div className="space-y-4">
          {imageData.map((image, index) => (
            <div key={image.id} className="space-y-4">
              <img
                src={image.image_url}
                alt={`Story illustration ${image.aspect_ratio}`}
                className="w-full rounded-lg"
              />
              <ImageControls
                storyId={storyId}
                imageUrl={image.image_url}
              />
            </div>
          ))}
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

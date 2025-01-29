import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageGenerationForm } from "./ImageGenerationForm";
import { ImageControls } from "./ImageControls";

interface StoryImageProps {
  storyId: string;
  storyContent: string;
}

export function StoryImage({ storyId, storyContent }: StoryImageProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing story image and image prompt if any
  const { data: storyData } = useQuery({
    queryKey: ['story-image-data', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [imageResult, storyResult] = await Promise.all([
        supabase
          .from('story_images')
          .select('*')
          .eq('story_id', storyId)
          .eq('user_id', session.user.id)
          .eq('aspect_ratio', '16:9')
          .maybeSingle(),
        supabase
          .from('stories')
          .select('image_prompt')
          .eq('id', storyId)
          .maybeSingle()
      ]);

      if (imageResult.error) {
        console.error('Error fetching image:', imageResult.error);
        return null;
      }

      if (storyResult.error) {
        console.error('Error fetching story:', storyResult.error);
        return null;
      }

      return {
        image: imageResult.data,
        imagePrompt: storyResult.data?.image_prompt
      };
    },
  });

  const handleCreateImage = async () => {
    try {
      setIsGenerating(true);
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

      // Use the stored image prompt or fall back to a default one
      const basePrompt = storyData?.imagePrompt || `Create a storybook illustration for this story: ${storyContent}`;
      
      // Generate both aspect ratios
      const aspectRatios = ['16:9', '9:16'];
      const imagePromises = aspectRatios.map(async (ratio) => {
        const enhancedPrompt = `Create a high-quality, detailed illustration suitable for a children's storybook in ${ratio} aspect ratio. Style: Use vibrant colors and a mix of 3D rendering and artistic illustration techniques. The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Specific scene: ${basePrompt}. Important: Do not include any text or words in the image.`;

        // Generate image using the edge function
        const { data, error: genError } = await supabase.functions.invoke('generate-story-image', {
          body: { prompt: enhancedPrompt },
        });

        if (genError) throw genError;

        // Save to Supabase
        const { error: saveError } = await supabase
          .from('story_images')
          .insert({
            story_id: storyId,
            user_id: session.user.id,
            image_url: data.imageUrl,
            aspect_ratio: ratio,
            credits_used: creditCost
          });

        if (saveError) {
          console.error('Error saving image:', saveError);
          throw new Error('Failed to save image to database');
        }

        return data.imageUrl;
      });

      await Promise.all(imagePromises);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['story-image-data', storyId] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

      toast({
        title: "Success",
        description: "Story images created successfully!",
      });

    } catch (error: any) {
      console.error('Error creating image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create story images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Image className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Story Image</h3>
      </div>

      {!storyData?.image ? (
        <ImageGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={handleCreateImage}
        />
      ) : (
        <>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <img
              src={storyData.image.image_url}
              alt="Story illustration"
              className="object-cover w-full h-full"
            />
          </div>
          <ImageControls 
            storyId={storyId} 
            imageUrl={storyData.image.image_url} 
          />
        </>
      )}
    </Card>
  );
}
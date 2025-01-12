import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageGenerationForm } from "./ImageGenerationForm";

interface StoryImageProps {
  storyId: string;
  storyContent: string;
}

export function StoryImage({ storyId, storyContent }: StoryImageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing story image if any
  const { data: storyImage } = useQuery({
    queryKey: ['story-image', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('story_images')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
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

      // Update credits before generating image
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { error: creditError } = await supabase
        .from('user_story_counts')
        .upsert({
          user_id: session.user.id,
          month_year: currentMonth,
          credits_used: (creditInfo?.creditsUsed || 0) + (creditInfo?.creditCost || 5),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,month_year'
        });

      if (creditError) {
        throw new Error('Failed to update credits');
      }

      // Generate image using the edge function
      const { data, error } = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: `Create an illustration for this story: ${storyContent}` },
      });

      if (error) throw error;

      // Save to Supabase
      const { error: saveError } = await supabase
        .from('story_images')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          image_url: data.imageUrl,
          credits_used: creditInfo?.creditCost || 5
        });

      if (saveError) throw saveError;

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['story-image', storyId] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

      toast({
        title: "Success",
        description: "Story image created successfully!",
      });

      setShowConfirmDialog(false);

    } catch (error: any) {
      console.error('Error creating image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create story image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  // Fetch credit cost and user's current credits
  const { data: creditInfo } = useQuery({
    queryKey: ['image-credits-info'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [{ data: config }, { data: userCredits }] = await Promise.all([
        supabase
          .from('api_configurations')
          .select('image_credits_cost')
          .eq('key_name', 'AUDIO_STORY_CREDITS')
          .single(),
        supabase
          .from('user_story_counts')
          .select('credits_used')
          .eq('user_id', session.user.id)
          .eq('month_year', new Date().toISOString().slice(0, 7))
          .single()
      ]);

      return {
        creditCost: config?.image_credits_cost || 5,
        creditsUsed: userCredits?.credits_used || 0
      };
    },
  });

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Image className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Story Image</h3>
      </div>

      {!storyImage ? (
        <ImageGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={handleCreateImage}
          creditCost={creditInfo?.creditCost}
        />
      ) : (
        <div className="relative aspect-square w-full rounded-lg overflow-hidden">
          <img
            src={storyImage.image_url}
            alt="Story illustration"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </Card>
  );
}
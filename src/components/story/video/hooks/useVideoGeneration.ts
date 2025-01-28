import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type VideoAspectRatio = "16:9" | "9:16";

export const useVideoGeneration = (storyId: string, storyContent: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreateVideo = async (aspectRatio: VideoAspectRatio) => {
    try {
      setIsGenerating(true);
      setGenerationStep("Initializing...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create video stories.",
          variant: "destructive",
        });
        return;
      }

      // Get current month's credits
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: userCredits } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .maybeSingle();

      // Get video credits cost
      const creditCost = 10;
      const currentCredits = userCredits?.credits_used || 0;

      setGenerationStep("Updating credits...");
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

      toast({
        title: "Generating video",
        description: "Please wait while we create your video...",
      });

      setGenerationStep("Generating video...");
      // Generate video using the edge function
      const { data, error } = await supabase.functions.invoke('generate-story-video', {
        body: { 
          storyId,
          aspectRatio,
          storyContent 
        },
      });

      if (error) throw error;

      if (!data?.videoUrl) {
        throw new Error('No video URL received');
      }

      setGenerationStep("Saving video...");
      // Save to Supabase
      const { error: saveError } = await supabase
        .from('story_videos')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          video_url: data.videoUrl,
          aspect_ratio: aspectRatio,
          credits_used: creditCost
        });

      if (saveError) throw saveError;

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['story-video', storyId] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

      toast({
        title: "Success",
        description: "Video story created successfully!",
      });

    } catch (error: any) {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create video story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep(undefined);
    }
  };

  return {
    isGenerating,
    generationStep,
    handleCreateVideo,
  };
};
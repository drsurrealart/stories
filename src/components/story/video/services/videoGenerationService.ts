
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { type VideoAspectRatio } from "../types";
import { loadContentFilters, containsInappropriateContent } from "@/utils/contentFilter";

export const generateBackgroundImage = async (
  storyId: string,
  storyContent: string,
  selectedAspectRatio: VideoAspectRatio | '',
  session: any
) => {
  if (!session) {
    toast({
      title: "Authentication required",
      description: "Please sign in to generate background image.",
      variant: "destructive",
    });
    return null;
  }

  // Load content filters and check content
  const bannedWords = await loadContentFilters();
  if (containsInappropriateContent(storyContent, bannedWords)) {
    toast({
      title: "Content Warning",
      description: "Your story contains content that may not be appropriate for image generation.",
      variant: "destructive",
    });
    return null;
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

  // Sanitize and format the prompt
  const sanitizedContent = storyContent
    .replace(/[^\w\s,.!?-]/g, '') // Remove special characters
    .trim();

  const videoPrompt = `Create a family-friendly cinematic scene: ${sanitizedContent}. 
    The image should be visually striking and suitable for ${selectedAspectRatio} video format. 
    Focus on creating a gentle, positive, and appropriate scene.
    Style: Use soft, pleasant lighting and composition typical of family-friendly content.`;

  // Generate image using the edge function
  const { data, error: genError } = await supabase.functions.invoke('generate-story-image', {
    body: { 
      prompt: videoPrompt,
      aspectRatio: selectedAspectRatio 
    },
  });

  if (genError) throw genError;

  return data.imageUrl;
};

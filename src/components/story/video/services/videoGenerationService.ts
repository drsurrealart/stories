
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { type VideoAspectRatio } from "../types";

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

  // Create a video-specific prompt
  const videoPrompt = `Create a cinematic, dynamic scene for a video adaptation of this story: ${storyContent}. 
    The image should be visually striking and suitable for ${selectedAspectRatio} video format. 
    Focus on creating a dramatic, atmospheric scene that captures the story's essence.
    Style: Use rich, cinematic lighting and composition typical of film scenes.`;

  const enhancedPrompt = `Create a high-quality, detailed illustration. 
    Style: Use vibrant colors and cinematic techniques. 
    The image should be engaging and dramatic, without any text overlays. 
    Focus on creating an emotional and immersive scene. 
    Specific scene: ${videoPrompt}. 
    Important: Do not include any text or words in the image.`;

  // Generate image using the edge function
  const { data, error: genError } = await supabase.functions.invoke('generate-story-image', {
    body: { prompt: enhancedPrompt },
  });

  if (genError) throw genError;

  return data.imageUrl;
};

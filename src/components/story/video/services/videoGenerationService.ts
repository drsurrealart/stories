
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { loadContentFilters, containsInappropriateContent } from "@/utils/contentFilter";

export const generateBackgroundImage = async (
  storyId: string,
  storyContent: string,
  userId: string
) => {
  try {
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
      .eq('user_id', userId)
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
        user_id: userId,
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
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Create a more controlled, family-friendly prompt
    const videoPrompt = `Create a gentle, child-friendly illustration: ${sanitizedContent}. 
      The scene should be peaceful and appropriate for all ages.
      Style: Use soft, pleasant colors and avoid any potentially frightening elements.`;

    // Generate images for both aspect ratios
    const [landscapeResponse, portraitResponse] = await Promise.all([
      supabase.functions.invoke('generate-story-image', {
        body: { 
          prompt: videoPrompt,
          aspectRatio: "16:9" 
        },
      }),
      supabase.functions.invoke('generate-story-image', {
        body: { 
          prompt: videoPrompt,
          aspectRatio: "9:16" 
        },
      })
    ]);

    if (landscapeResponse.error) {
      console.error('Landscape generation error:', landscapeResponse.error);
      throw new Error(landscapeResponse.error.message || 'Failed to generate landscape image');
    }
    if (portraitResponse.error) {
      console.error('Portrait generation error:', portraitResponse.error);
      throw new Error(portraitResponse.error.message || 'Failed to generate portrait image');
    }

    // Save both images
    await Promise.all([
      supabase.from('story_images').insert({
        story_id: storyId,
        user_id: userId,
        image_url: landscapeResponse.data.imageUrl,
        aspect_ratio: "16:9"
      }),
      supabase.from('story_images').insert({
        story_id: storyId,
        user_id: userId,
        image_url: portraitResponse.data.imageUrl,
        aspect_ratio: "9:16"
      })
    ]);

    return {
      "16:9": landscapeResponse.data.imageUrl,
      "9:16": portraitResponse.data.imageUrl
    };
  } catch (error: any) {
    console.error('Error in generateBackgroundImage:', error);
    throw error;
  }
};

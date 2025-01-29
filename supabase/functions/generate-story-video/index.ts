import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode as base64Encode } from "https://deno.land/std@0.82.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyId, aspectRatio, audioUrl, storyContent } = await req.json()
    console.log('Starting video generation for story:', storyId)
    console.log('Using audio URL:', audioUrl)

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      throw new Error('Failed to get user')
    }

    // Get the story's image prompt
    const { data: story, error: storyError } = await supabaseClient
      .from('stories')
      .select('image_prompt, content')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Generate image using DALL-E
    console.log('Generating background image...');
    const imagePrompt = story.image_prompt || `Create a storybook illustration for this story: ${story.content}`;
    const enhancedPrompt = `Create a high-quality, detailed illustration suitable for a children's storybook. Style: Use vibrant colors and a mix of 3D rendering and artistic illustration techniques. The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Specific scene: ${imagePrompt}. Important: Do not include any text or words in the image.`;

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      throw new Error(`Failed to generate image: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await imageResponse.json();
    const backgroundImageUrl = imageData.data[0].url;

    // Download the background image
    console.log('Downloading background image:', backgroundImageUrl);
    const backgroundResponse = await fetch(backgroundImageUrl);
    if (!backgroundResponse.ok) {
      throw new Error('Failed to download background image');
    }
    const backgroundBuffer = await backgroundResponse.arrayBuffer();

    // Download the audio file
    console.log('Downloading audio file:', audioUrl);
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error('Failed to download audio file');
    }
    const audioBuffer = await audioResponse.arrayBuffer();

    // Upload image and audio to temporary storage
    const imageFileName = `temp_${crypto.randomUUID()}.png`;
    const audioFileName = `temp_${crypto.randomUUID()}.mp3`;
    const videoFileName = `${crypto.randomUUID()}.mp4`;

    // Upload temporary files
    await supabaseClient.storage
      .from('story-videos')
      .upload(imageFileName, backgroundBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    await supabaseClient.storage
      .from('story-videos')
      .upload(audioFileName, audioBuffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
      });

    // Get URLs for the uploaded files
    const { data: { publicUrl: imageUrl } } = supabaseClient.storage
      .from('story-videos')
      .getPublicUrl(imageFileName);

    const { data: { publicUrl: tempAudioUrl } } = supabaseClient.storage
      .from('story-videos')
      .getPublicUrl(audioFileName);

    // Use FFmpeg.wasm to combine image and audio
    console.log('Combining image and audio using FFmpeg...');
    
    // Call FFmpeg edge function to process the video
    const ffmpegResponse = await supabaseClient.functions.invoke('process-story-video', {
      body: {
        imageUrl,
        audioUrl: tempAudioUrl,
        outputFileName: videoFileName,
        aspectRatio
      }
    });

    if (ffmpegResponse.error) {
      throw new Error(`FFmpeg processing failed: ${ffmpegResponse.error}`);
    }

    // Get the final video URL
    const { data: { publicUrl: videoUrl } } = supabaseClient.storage
      .from('story-videos')
      .getPublicUrl(videoFileName);

    // Clean up temporary files
    await Promise.all([
      supabaseClient.storage.from('story-videos').remove([imageFileName]),
      supabaseClient.storage.from('story-videos').remove([audioFileName])
    ]);

    console.log('Successfully generated video:', videoUrl);

    return new Response(
      JSON.stringify({ videoUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    );

  } catch (error) {
    console.error('Error in generate-story-video function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    );
  }
})
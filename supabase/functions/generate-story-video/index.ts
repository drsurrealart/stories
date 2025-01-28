import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, aspectRatio, storyContent, audioUrl } = await req.json();
    console.log('Received request for story:', storyId, 'with aspect ratio:', aspectRatio);

    if (!audioUrl) {
      throw new Error('Audio URL is required for video generation');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a background image using DALL-E
    const imagePrompt = `Create a minimalist, abstract background suitable for a video. The image should be simple, elegant, and not distracting. Style: soft gradients and subtle patterns. Color scheme: calming and professional. ${aspectRatio === "16:9" ? "Landscape orientation" : "Portrait orientation"}`

    console.log('Generating background image with DALL-E...');
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: aspectRatio === "16:9" ? "1792x1024" : "1024x1792",
      }),
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to generate background image');
    }

    const imageData = await imageResponse.json();
    const backgroundImageUrl = imageData.data[0].url;

    // Call Python video generation service
    console.log('Calling Python video generation service...');
    const videoGenerationResponse = await fetch('https://api.python-video-service.com/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PYTHON_SERVICE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        backgroundImageUrl,
        audioUrl,
        aspectRatio,
        outputFormat: 'mp4'
      }),
    });

    if (!videoGenerationResponse.ok) {
      const errorData = await videoGenerationResponse.text();
      console.error('Video generation failed:', errorData);
      throw new Error(`Failed to generate video: ${errorData}`);
    }

    const videoData = await videoGenerationResponse.blob();

    // Generate a unique filename
    const fileName = `${crypto.randomUUID()}.mp4`;
    console.log('Generated filename:', fileName);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('story-videos')
      .upload(fileName, videoData, {
        contentType: 'video/mp4',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      throw uploadError;
    }

    console.log('Successfully generated and uploaded video');

    return new Response(
      JSON.stringify({ 
        success: true, 
        videoUrl: fileName,
        processingMethod: 'moviepy'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    );

  } catch (error) {
    console.error('Error in generate-video function:', error);
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
});
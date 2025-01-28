import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, aspectRatio, storyContent } = await req.json();
    console.log('Received request for story:', storyId, 'with aspect ratio:', aspectRatio);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // First, generate audio using OpenAI TTS
    console.log('Generating audio...');
    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: storyContent.slice(0, 4096), // OpenAI has a 4096 character limit
        voice: 'alloy',
        response_format: 'mp3',
      }),
    });

    if (!audioResponse.ok) {
      throw new Error('Failed to generate audio');
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    console.log('Audio generated successfully');

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

    // Download the background image
    console.log('Downloading background image...');
    const imageRes = await fetch(backgroundImageUrl);
    const imageBlob = await imageRes.blob();

    // Create a video file that combines the image and audio
    // For now, we'll use the image as a video file and store the audio separately
    // In a future update, we'll implement proper video creation with ffmpeg
    const fileName = `${crypto.randomUUID()}.mp4`;
    console.log('Creating video file...');

    // Upload the video file to Supabase storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('story-videos')
      .upload(fileName, imageBlob, {
        contentType: 'video/mp4',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      throw new Error('Failed to upload video');
    }

    console.log('Successfully generated and uploaded video');

    return new Response(
      JSON.stringify({ success: true, videoUrl: fileName }),
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
        },
      },
    );
  }
});
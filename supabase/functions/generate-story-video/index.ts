import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.7'
import { fetchFile, toBlobURL } from 'https://esm.sh/@ffmpeg/util@0.12.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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

    // Download the background image and audio
    console.log('Downloading background image and audio...');
    const [imageRes, audioRes] = await Promise.all([
      fetch(backgroundImageUrl),
      fetch(audioUrl)
    ]);

    const [imageBlob, audioBlob] = await Promise.all([
      imageRes.blob(),
      audioRes.blob()
    ]);

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg();
    console.log('Loading FFmpeg...');
    await ffmpeg.load();

    // Convert blobs to array buffers
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const audioArrayBuffer = await audioBlob.arrayBuffer();

    // Write files to FFmpeg virtual filesystem
    await ffmpeg.writeFile('background.png', new Uint8Array(imageArrayBuffer));
    await ffmpeg.writeFile('audio.mp3', new Uint8Array(audioArrayBuffer));

    // Get audio duration using FFprobe
    const { duration } = await ffmpeg.probe('audio.mp3');
    console.log('Audio duration:', duration);

    // Generate video from image and audio
    console.log('Generating video...');
    await ffmpeg.exec([
      '-loop', '1',
      '-i', 'background.png',
      '-i', 'audio.mp3',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      'output.mp4'
    ]);

    // Read the generated video
    const videoData = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([videoData], { type: 'video/mp4' });

    // Generate a unique filename
    const fileName = `${crypto.randomUUID()}.mp4`;
    console.log('Generated filename:', fileName);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('story-videos')
      .upload(fileName, videoBlob, {
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
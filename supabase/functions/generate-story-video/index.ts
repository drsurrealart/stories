import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
    const { storyId, aspectRatio, storyContent, audioUrl } = await req.json()
    console.log('Received request for story:', storyId, 'with aspect ratio:', aspectRatio)

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
      .select('image_prompt')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Generate image using DALL-E
    console.log('Generating background image...');
    const imagePrompt = story.image_prompt || `Create a storybook illustration for this story: ${storyContent}`;
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
      throw new Error('Failed to generate image');
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

    // Create temporary directory
    const tempDir = await Deno.makeTempDir();
    const audioPath = `${tempDir}/audio.mp3`;
    const outputPath = `${tempDir}/output.mp4`;
    const backgroundPath = `${tempDir}/background.png`;

    // Write files
    await Deno.writeFile(audioPath, new Uint8Array(audioBuffer));
    await Deno.writeFile(backgroundPath, new Uint8Array(backgroundBuffer));

    // Create FFmpeg command
    const ffmpegCmd = new Deno.Command("ffmpeg", {
      args: [
        "-loop", "1", // Loop the image
        "-i", backgroundPath, // Input image file
        "-i", audioPath, // Input audio file
        "-c:v", "libx264", // Video codec
        "-tune", "stillimage", // Optimize for still image
        "-c:a", "aac", // Audio codec
        "-b:a", "192k", // Audio bitrate
        "-pix_fmt", "yuv420p", // Pixel format for compatibility
        "-shortest", // End when audio ends
        "-y", // Overwrite output file
        outputPath // Output file
      ]
    });

    // Execute FFmpeg command
    console.log('Executing FFmpeg command...');
    const { success, stdout, stderr } = await ffmpegCmd.output();
    console.log('FFmpeg output:', new TextDecoder().decode(stdout));
    console.log('FFmpeg errors:', new TextDecoder().decode(stderr));

    if (!success) {
      throw new Error('Failed to generate video');
    }

    // Read the generated video file
    console.log('Reading generated video file...');
    const videoData = await Deno.readFile(outputPath);

    // Clean up temporary directory
    await Deno.remove(tempDir, { recursive: true });

    // Upload video to Supabase Storage
    console.log('Uploading video to storage...')
    const videoFileName = `${crypto.randomUUID()}.mp4`
    const { error: uploadError } = await supabaseClient.storage
      .from('story-videos')
      .upload(videoFileName, videoData, {
        contentType: 'video/mp4',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      throw uploadError
    }

    console.log('Successfully generated and uploaded video')

    // Get the public URL for the video
    const { data: { publicUrl } } = supabaseClient.storage
      .from('story-videos')
      .getPublicUrl(videoFileName)

    return new Response(
      JSON.stringify({ videoUrl: publicUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )

  } catch (error) {
    console.error('Error in generate-story-video function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  }
})
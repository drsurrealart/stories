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

    // Download the audio file
    console.log('Downloading audio file:', audioUrl)
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error('Failed to download audio file')
    }
    const audioBuffer = await audioResponse.arrayBuffer()
    const audioBase64 = base64Encode(new Uint8Array(audioBuffer))

    // Create a temporary file for the audio
    const audioPath = `temp_${crypto.randomUUID()}.mp3`
    await Deno.writeFile(audioPath, new Uint8Array(audioBuffer))

    // Create FFmpeg command
    const ffmpegCmd = new Deno.Command("ffmpeg", {
      args: [
        "-i", audioPath,           // Input audio file
        "-i", "background.png",    // Input background image
        "-c:v", "libx264",        // Video codec
        "-c:a", "aac",            // Audio codec
        "-shortest",              // End when shortest input ends
        "-pix_fmt", "yuv420p",    // Pixel format for compatibility
        "-y",                     // Overwrite output file
        "output.mp4"              // Output file
      ]
    });

    // Execute FFmpeg command
    const { success, stdout, stderr } = await ffmpegCmd.output();
    console.log('FFmpeg output:', new TextDecoder().decode(stdout));
    console.log('FFmpeg errors:', new TextDecoder().decode(stderr));

    if (!success) {
      throw new Error('Failed to generate video');
    }

    // Read the generated video file
    const videoData = await Deno.readFile("output.mp4");

    // Clean up temporary files
    await Deno.remove(audioPath);
    await Deno.remove("output.mp4");

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
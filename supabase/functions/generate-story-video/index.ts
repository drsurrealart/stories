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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { storyId, aspectRatio, storyContent } = await req.json()
    console.log('Received request for story:', storyId, 'with aspect ratio:', aspectRatio)

    // Get user ID from the request headers
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user ID from the JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      throw new Error('Failed to get user')
    }

    // Get existing audio story
    const { data: audioStory, error: audioError } = await supabaseClient
      .from('audio_stories')
      .select('audio_url')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (audioError || !audioStory) {
      throw new Error('Failed to fetch audio story')
    }

    // Get the audio file URL
    const { data: { publicUrl: audioUrl } } = supabaseClient
      .storage
      .from('audio-stories')
      .getPublicUrl(audioStory.audio_url)

    // Generate a background image using DALL-E
    const imagePrompt = `Create a minimalist, abstract background suitable for a video. The image should be simple, elegant, and not distracting. Style: soft gradients and subtle patterns. Color scheme: calming and professional. ${aspectRatio === "16:9" ? "Landscape orientation" : "Portrait orientation"}`

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
    })

    if (!imageResponse.ok) {
      const error = await imageResponse.json()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate background image')
    }

    const imageData = await imageResponse.json()
    const backgroundImageUrl = imageData.data[0].url

    // Download the background image
    const imageRes = await fetch(backgroundImageUrl)
    const imageBlob = await imageRes.blob()

    // Upload background image to Supabase storage
    const backgroundFileName = `${crypto.randomUUID()}.png`
    const { error: uploadError } = await supabaseClient
      .storage
      .from('story-videos')
      .upload(backgroundFileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Error uploading background image:', uploadError)
      throw new Error('Failed to upload background image')
    }

    // Get the FFmpeg WebAssembly module
    const ffmpeg = await import('https://esm.sh/@ffmpeg/ffmpeg@0.12.7')
    const { createFFmpeg, fetchFile } = ffmpeg

    // Create FFmpeg instance
    const ffmpegInstance = createFFmpeg({ log: true })
    await ffmpegInstance.load()

    // Download the audio file
    const audioRes = await fetch(audioUrl)
    const audioBlob = await audioRes.blob()
    const audioArrayBuffer = await audioBlob.arrayBuffer()

    // Write files to FFmpeg virtual filesystem
    ffmpegInstance.FS('writeFile', 'audio.mp3', new Uint8Array(audioArrayBuffer))
    ffmpegInstance.FS('writeFile', 'background.png', await fetchFile(backgroundImageUrl))

    // Generate video with FFmpeg
    const outputFileName = `${crypto.randomUUID()}.mp4`
    const resolution = aspectRatio === "16:9" ? "1920x1080" : "1080x1920"

    await ffmpegInstance.run(
      '-loop', '1',
      '-i', 'background.png',
      '-i', 'audio.mp3',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-s', resolution,
      outputFileName
    )

    // Read the generated video file
    const videoData = ffmpegInstance.FS('readFile', outputFileName)

    // Upload video to Supabase storage
    const { error: videoUploadError } = await supabaseClient
      .storage
      .from('story-videos')
      .upload(outputFileName, videoData.buffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
      })

    if (videoUploadError) {
      console.error('Error uploading video:', videoUploadError)
      throw new Error('Failed to upload video')
    }

    console.log('Successfully generated and uploaded video')

    return new Response(
      JSON.stringify({ success: true, videoUrl: outputFileName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error in generate-video function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
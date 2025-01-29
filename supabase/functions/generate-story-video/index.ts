import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    // Generate background image using DALL-E
    console.log('Generating background image...')
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a background image for a story about: ${storyContent.slice(0, 200)}...`,
        n: 1,
        size: aspectRatio === "16:9" ? "1792x1024" : "1024x1792",
      }),
    })

    if (!imageResponse.ok) {
      const error = await imageResponse.json()
      console.error('DALL-E API error:', error)
      throw new Error('Failed to generate background image')
    }

    const imageData = await imageResponse.json()
    const backgroundImageUrl = imageData.data[0].url

    // Download background image
    const imageRes = await fetch(backgroundImageUrl)
    const imageBlob = await imageRes.blob()

    // Upload background image to Supabase storage
    const imagePath = `${crypto.randomUUID()}.png`
    const { error: uploadImageError } = await supabaseClient.storage
      .from('story-videos')
      .upload(imagePath, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      })

    if (uploadImageError) {
      console.error('Error uploading image:', uploadImageError)
      throw uploadImageError
    }

    // Get the public URL of the uploaded image
    const { data: { publicUrl: backgroundImage } } = supabaseClient.storage
      .from('story-videos')
      .getPublicUrl(imagePath)

    // Use FFmpeg.wasm to create video
    console.log('Creating video with FFmpeg...')
    const ffmpegResponse = await fetch('https://ffmpeg-api.example.com/create-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        backgroundImage,
        audioUrl,
        aspectRatio,
        outputFormat: 'mp4',
      }),
    })

    if (!ffmpegResponse.ok) {
      const errorData = await ffmpegResponse.text()
      console.error('Video generation failed:', errorData)
      throw new Error(`Failed to generate video: ${errorData}`)
    }

    const videoData = await ffmpegResponse.blob()

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error in generate-story-video function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
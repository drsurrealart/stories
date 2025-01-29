import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { storyId, aspectRatio, storyContent, audioUrl } = await req.json()
    console.log('Starting video generation for story:', storyId)
    console.log('Using audio URL:', audioUrl)
    console.log('Aspect ratio:', aspectRatio)

    if (!storyId || !aspectRatio || !audioUrl) {
      throw new Error('Missing required parameters')
    }

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
      console.error('User authentication error:', userError)
      throw new Error('Failed to get user')
    }

    // Check if we already have a video background
    const { data: existingVideo } = await supabaseClient
      .from('story_videos')
      .select('video_url')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .maybeSingle()

    let backgroundImageUrl
    
    if (existingVideo?.video_url) {
      console.log('Using existing background image:', existingVideo.video_url)
      backgroundImageUrl = existingVideo.video_url
    } else {
      // Generate image using DALL-E
      console.log('Generating new background image...')
      const imagePrompt = `Create a high-quality, detailed illustration suitable for a children's storybook. Style: Use vibrant colors and a mix of 3D rendering and artistic illustration techniques. The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Specific scene: ${storyContent}. Important: Do not include any text or words in the image.`

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
          size: "1024x1024",
        }),
      })

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        console.error('DALL-E API error:', errorData)
        throw new Error(`Failed to generate image: ${errorData.error?.message || 'Unknown error'}`)
      }

      const imageData = await imageResponse.json()
      backgroundImageUrl = imageData.data[0].url
      console.log('Background image generated:', backgroundImageUrl)
    }

    // Generate unique filename for the video
    const videoFileName = `${crypto.randomUUID()}.mp4`

    // Process video
    console.log('Processing video...')
    try {
      const processingResponse = await supabaseClient.functions.invoke('process-story-video', {
        body: {
          imageUrl: backgroundImageUrl,
          audioUrl,
          outputFileName: videoFileName,
          aspectRatio
        }
      })

      if (processingResponse.error) {
        console.error('Video processing error:', processingResponse.error)
        throw new Error(`Video processing failed: ${processingResponse.error}`)
      }

      console.log('Video processing completed')

      // Get the final video URL
      const { data: { publicUrl: videoUrl } } = supabaseClient.storage
        .from('story-videos')
        .getPublicUrl(videoFileName)

      // Save video information to the database
      const { error: dbError } = await supabaseClient
        .from('story_videos')
        .insert({
          story_id: storyId,
          user_id: user.id,
          video_url: videoUrl,
          aspect_ratio: aspectRatio,
          credits_used: 10
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw dbError
      }

      console.log('Video generation completed successfully')
      return new Response(
        JSON.stringify({ videoUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (error) {
      console.error('Error in video processing:', error)
      throw error
    }

  } catch (error) {
    console.error('Error in generate-story-video function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
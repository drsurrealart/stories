import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Generate a unique filename
    const filename = `${crypto.randomUUID()}.mp4`
    console.log('Generated filename:', filename)

    // TODO: Implement actual video generation logic here
    // For now, we'll just return a mock video URL
    const mockVideoUrl = filename

    console.log('Successfully generated video story')

    return new Response(
      JSON.stringify({ success: true, videoUrl: mockVideoUrl }),
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
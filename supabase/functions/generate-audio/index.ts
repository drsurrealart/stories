import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { storyId, voice } = await req.json()
    console.log('Received request for story:', storyId, 'with voice:', voice)

    // Get story content from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: story, error: storyError } = await supabaseClient
      .from('stories')
      .select('title, content')
      .eq('id', storyId)
      .single()

    if (storyError) {
      console.error('Error fetching story:', storyError)
      throw new Error('Failed to fetch story content')
    }

    // Prepare text for TTS
    const textToSpeak = `${story.title}. ${story.content}`
    console.log('Preparing to generate audio for text length:', textToSpeak.length)

    // Generate speech using OpenAI API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: textToSpeak,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer()
    const audioBytes = new Uint8Array(audioBuffer)

    // Generate unique filename
    const fileName = `${crypto.randomUUID()}.mp3`
    console.log('Generated filename:', fileName)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('audio-stories')
      .upload(fileName, audioBytes, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Error uploading audio:', uploadError)
      throw new Error('Failed to upload audio file')
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('audio-stories')
      .getPublicUrl(fileName)

    // Save audio story record
    const { error: audioStoryError } = await supabaseClient
      .from('audio_stories')
      .insert({
        story_id: storyId,
        user_id: req.headers.get('x-user-id'),
        audio_url: publicUrl,
        voice_id: voice,
      })

    if (audioStoryError) {
      console.error('Error saving audio story:', audioStoryError)
      throw new Error('Failed to save audio story record')
    }

    console.log('Successfully generated and saved audio story')

    return new Response(
      JSON.stringify({ success: true, audioUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error in generate-audio function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

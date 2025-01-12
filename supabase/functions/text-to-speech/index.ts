import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function truncateToLastSentence(text: string, maxLength: number = 4096) {
  if (text.length <= maxLength) return text;
  
  const subset = text.substring(0, maxLength);
  const lastPeriod = subset.lastIndexOf('.');
  
  if (lastPeriod === -1) {
    console.log('No period found, truncating at maxLength');
    return subset;
  }
  
  return subset.substring(0, lastPeriod + 1);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()
    console.log('Received request with voice:', voice);

    if (!text) {
      throw new Error('Text is required')
    }

    // Truncate text to maximum allowed length (4096 characters)
    const processedText = truncateToLastSentence(text, 4096);
    console.log(`Processing text of length ${processedText.length}`);

    // Generate speech from text
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: processedText,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    console.log('Successfully received audio response');
    
    // Convert audio buffer to base64 more efficiently
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
    const base64Audio = btoa(binary);

    console.log('Successfully encoded audio to base64');
    
    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
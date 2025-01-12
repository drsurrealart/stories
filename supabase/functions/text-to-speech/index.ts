import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Limit to ~1000 characters, ending at a complete sentence
function getFirstSentences(text: string, maxLength = 1000): string {
  console.log(`Original text length: ${text.length}`);
  
  if (text.length <= maxLength) {
    console.log('Text is within limit, returning full text');
    return text;
  }
  
  // Find the last sentence break before maxLength
  const subset = text.substring(0, maxLength);
  const lastPeriod = subset.lastIndexOf('.');
  
  if (lastPeriod === -1) {
    console.log('No period found, truncating at maxLength');
    return subset;
  }
  
  const result = text.substring(0, lastPeriod + 1);
  console.log(`Truncated text length: ${result.length}`);
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Processing text-to-speech request');
    const { text, voice } = await req.json();

    if (!text) {
      console.error('No text provided');
      throw new Error('Text is required');
    }

    console.log(`Using voice: ${voice}`);
    
    // Get just the first few sentences
    const processedText = getFirstSentences(text);
    console.log(`Processing text of length: ${processedText.length}`);

    // Make request to OpenAI TTS API
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
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate speech');
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Limit to ~1000 characters, ending at a complete sentence
function getFirstSentences(text: string, maxLength = 1000): string {
  if (text.length <= maxLength) return text;
  
  // Find the last sentence break before maxLength
  const subset = text.substring(0, maxLength);
  const lastPeriod = subset.lastIndexOf('.');
  const lastQuestion = subset.lastIndexOf('?');
  const lastExclamation = subset.lastIndexOf('!');
  
  // Get the last sentence break position
  const lastBreak = Math.max(lastPeriod, lastQuestion, lastExclamation);
  
  // If no sentence break found, just return the first maxLength characters
  if (lastBreak === -1) {
    return subset + "...";
  }
  
  // Return up to the last sentence break
  return text.substring(0, lastBreak + 1);
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

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    console.log('Making request to OpenAI API...');
    
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
    
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('Sending audio response back to client');
    
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
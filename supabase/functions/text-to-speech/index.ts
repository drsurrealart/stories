import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_CHUNK_LENGTH = 4000; // Slightly less than 4096 to be safe

function splitTextIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  let remainingText = text;
  
  while (remainingText.length > 0) {
    if (remainingText.length <= MAX_CHUNK_LENGTH) {
      chunks.push(remainingText);
      break;
    }

    // Find the last sentence break within the chunk limit
    let chunkEnd = MAX_CHUNK_LENGTH;
    const lastPeriod = remainingText.substring(0, MAX_CHUNK_LENGTH).lastIndexOf('.');
    const lastQuestion = remainingText.substring(0, MAX_CHUNK_LENGTH).lastIndexOf('?');
    const lastExclamation = remainingText.substring(0, MAX_CHUNK_LENGTH).lastIndexOf('!');
    
    // Use the latest sentence break found
    if (lastPeriod > 0 || lastQuestion > 0 || lastExclamation > 0) {
      chunkEnd = Math.max(lastPeriod, lastQuestion, lastExclamation) + 1;
    }

    chunks.push(remainingText.substring(0, chunkEnd).trim());
    remainingText = remainingText.substring(chunkEnd).trim();
  }
  
  return chunks;
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
    console.log('Splitting text into chunks...');
    
    const chunks = splitTextIntoChunks(text);
    console.log(`Text split into ${chunks.length} chunks`);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Process each chunk
    const audioChunks: Uint8Array[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: chunks[i],
          voice: voice || 'alloy',
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(error.error?.message || 'Failed to generate speech');
      }

      const arrayBuffer = await response.arrayBuffer();
      audioChunks.push(new Uint8Array(arrayBuffer));
    }

    console.log('Successfully generated all audio chunks, combining...');
    
    // Combine all chunks into a single Uint8Array
    const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedAudio = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of audioChunks) {
      combinedAudio.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to base64
    const base64Audio = btoa(String.fromCharCode(...combinedAudio));

    console.log('Sending combined audio response back to client');
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
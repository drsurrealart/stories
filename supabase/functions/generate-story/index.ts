import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    console.log("Received preferences:", preferences);

    const prompt = `Create a ${preferences.genre} story for ${preferences.ageGroup} age group about ${preferences.moral}. Format the story with a clear title at the start and a moral lesson at the end. The story should be engaging and end with a clear moral lesson. Keep it concise but meaningful. Do not use asterisks or other decorative characters in the formatting.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a skilled storyteller who creates engaging, age-appropriate stories with clear moral lessons. Each story must be completely unique - never reuse character names, plot elements, or titles from previous stories. Create fresh, original content every time. Format the output with a Title at the start and a Moral at the end, without using any asterisks or decorative characters.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 1.2, // Increased for more randomness
        presence_penalty: 1.0, // Penalize topic repetition
        frequency_penalty: 1.0, // Penalize phrase repetition
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI response received");

    return new Response(
      JSON.stringify({ story: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
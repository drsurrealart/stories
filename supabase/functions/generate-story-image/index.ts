import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style = "realistic" } = await req.json();

    // Get the active image generation provider
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: config } = await supabaseClient
      .from('api_configurations')
      .select('image_generation_provider, is_active')
      .eq('key_name', 'RUNWARE_API_KEY')
      .single();

    const useRunware = config?.is_active && config?.image_generation_provider === 'runware';

    if (useRunware) {
      // Use Runware.ai
      const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
      if (!runwareApiKey) {
        throw new Error('Runware API key not configured');
      }

      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: runwareApiKey
          },
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            positivePrompt: prompt,
            model: "runware:100@1",
            width: 1024,
            height: 1024,
            numberResults: 1,
            outputFormat: "WEBP"
          }
        ])
      });

      const data = await response.json();
      if (data.error || !data.data?.[1]?.imageURL) {
        throw new Error(data.error?.message || 'Failed to generate image with Runware');
      }

      return new Response(
        JSON.stringify({ imageUrl: data.data[1].imageURL }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Use OpenAI (existing implementation)
      const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image with OpenAI');
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ imageUrl: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-story-image function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
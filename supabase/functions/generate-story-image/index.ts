
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
    const { prompt, aspectRatio = "16:9" } = await req.json();

    // Enhanced content safety check with more comprehensive list
    const bannedPhrases = [
      'nude', 'naked', 'explicit', 'nsfw', 'porn', 'violence', 'gore', 'blood',
      'death', 'kill', 'weapon', 'gun', 'inappropriate', 'adult', 'sexual'
    ];
    
    const normalizedPrompt = prompt.toLowerCase();
    if (bannedPhrases.some(phrase => normalizedPrompt.includes(phrase))) {
      console.error('Content safety check failed for prompt:', prompt);
      throw new Error('Content contains inappropriate terms');
    }

    // Get the active image generation provider
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: config } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('key_name', 'IMAGE_GENERATION_PROVIDER')
      .single();

    const useRunware = config?.is_active;

    if (useRunware) {
      const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
      if (!runwareApiKey) {
        throw new Error('Runware API key not configured');
      }

      const width = aspectRatio === "16:9" ? 1024 : 576;
      const height = aspectRatio === "16:9" ? 576 : 1024;

      // Enhanced prompt with stronger family-friendly emphasis
      const enhancedPrompt = `Create a gentle, family-friendly illustration suitable for children: ${prompt}. 
        Style: Use soft colors and avoid any scary or inappropriate elements. 
        Make it suitable for all ages.`;

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
            positivePrompt: enhancedPrompt,
            model: "runware:100@1",
            width,
            height,
            numberResults: 1,
            outputFormat: "WEBP",
            steps: 4,
            CFGScale: 1,
            scheduler: "FlowMatchEulerDiscreteScheduler",
            strength: 0.8,
            safetyFilter: true
          }
        ])
      });

      const data = await response.json();
      console.log('Runware response:', JSON.stringify(data));
      
      if (data.error || !data.data?.[1]?.imageURL) {
        throw new Error(data.error?.message || 'Failed to generate image with Runware');
      }

      return new Response(
        JSON.stringify({ imageUrl: data.data[1].imageURL }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Enhanced prompt with stronger family-friendly emphasis for DALL-E
      const enhancedPrompt = `Create a gentle, family-friendly illustration suitable for children: ${prompt}. 
        The image must be completely safe and appropriate for all ages. 
        Use soft colors and cheerful elements.`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI error:', error);
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
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function loadContentFilters(supabase: any) {
  const { data: filters } = await supabase
    .from('content_filters')
    .select('word');
  return filters?.map((f: any) => f.word.toLowerCase()) || [];
}

function containsInappropriateContent(text: string, bannedWords: string[]): boolean {
  const normalizedText = text.toLowerCase();
  return bannedWords.some(word => normalizedText.includes(word.toLowerCase()));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    console.log('Received preferences:', preferences);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('Invalid token');
    }

    // Load content filters
    const bannedWords = await loadContentFilters(supabase);
    console.log('Content filters loaded');

    // Create the story prompt
    const storyPrompt = `Create a ${preferences.genre} story for ${preferences.ageGroup} about ${preferences.moral}.
${preferences.characterName1 ? `Use "${preferences.characterName1}" as the main character.` : ''}
${preferences.characterName2 ? `Include "${preferences.characterName2}" as another character.` : ''}

Guidelines:
- Write in clear, natural language
- Keep sentences focused and meaningful
- Include realistic dialogue and descriptions
- End with a clear moral lesson
- Keep it family-friendly and age-appropriate
- ${preferences.lengthPreference === 'short' ? 'Keep it brief and concise' : preferences.lengthPreference === 'long' ? 'Make it more detailed' : 'Keep it moderate length'}
${preferences.language !== 'english' ? `- Write in ${preferences.language}` : ''}
${preferences.tone !== 'standard' ? `- Use a ${preferences.tone} tone` : ''}

Format:
- Start with a clear title
- Write the story in clear paragraphs
- End with "Moral: [the moral lesson]"`;

    console.log('Sending request to OpenAI');
    const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a skilled storyteller who creates clear, engaging stories with meaningful moral lessons. Focus on natural dialogue and descriptions that move the story forward.',
          },
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const storyData = await storyResponse.json();
    const generatedStory = storyData.choices[0].message.content;
    console.log('Story generated successfully');

    // Generate enrichment content
    const enrichmentPrompt = `Based on this story, generate:
1. Three reflection questions that help readers understand the moral lesson
2. Three action steps readers can take to apply the lesson
3. Three discussion prompts for group conversations

Format the response as JSON with these keys: reflection_questions (array), action_steps (array), discussion_prompts (array).

Story:
${generatedStory}`;

    console.log('Generating enrichment content');
    const enrichmentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You create clear, practical learning materials from stories. Format your response as valid JSON.',
          },
          {
            role: 'user',
            content: enrichmentPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!enrichmentResponse.ok) {
      const errorText = await enrichmentResponse.text();
      console.error("OpenAI API error (enrichment):", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const enrichmentData = await enrichmentResponse.json();
    let parsedEnrichment;
    try {
      parsedEnrichment = JSON.parse(enrichmentData.choices[0].message.content);
      console.log("Successfully parsed enrichment content");
    } catch (error) {
      console.error("Error parsing enrichment content:", error);
      console.log("Raw enrichment content:", enrichmentData.choices[0].message.content);
      throw new Error('Failed to parse enrichment content');
    }

    return new Response(
      JSON.stringify({ 
        story: generatedStory,
        enrichment: parsedEnrichment
      }),
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
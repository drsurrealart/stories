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
    if (userError || !user) throw new Error('Invalid token');

    // Load content filters
    const bannedWords = await loadContentFilters(supabase);

    // Character names handling
    const characterNames = [preferences.characterName1, preferences.characterName2]
      .filter(Boolean)
      .map(name => name.trim())
      .filter(name => name.length > 0 && name.length <= 20)
      .join(" and ");
    
    const characterPrompt = characterNames 
      ? `Use the character names "${characterNames}" as the main characters.`
      : "Create natural, relatable character names.";

    // Core story prompt
    const storyPrompt = `Create a concise and engaging ${preferences.genre} story for ${preferences.ageGroup} readers about ${preferences.moral}. 
${characterPrompt}
Length: ${preferences.lengthPreference === 'short' ? 'Keep it brief and focused.' : preferences.lengthPreference === 'long' ? 'Make it detailed but avoid unnecessary words.' : 'Keep it moderate in length.'}
${preferences.tone !== 'standard' ? `Tone: Make it ${preferences.tone}.` : ''}
${preferences.language !== 'english' ? `Write in ${preferences.language}.` : ''}

Format:
- Start with a clear, simple title
- Write the story in clear, engaging paragraphs
- End with a clear moral lesson
- Avoid unnecessary words or repetition
- Keep it family-friendly and age-appropriate
- Do not use any special formatting characters`;

    // Generate story
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
            content: 'You are a skilled storyteller who creates clear, focused stories with meaningful morals. Write in a direct style without unnecessary words or repetition.',
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

    // Generate enrichment content
    const enrichmentPrompt = `For this story, create focused reflection questions and action steps:

${generatedStory}

Format the response as valid JSON with this structure:
{
  "reflection_questions": ["question1", "question2", "question3"],
  "action_steps": ["step1", "step2", "step3"]
}`;

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
            content: 'Create focused, meaningful reflection questions and action steps.',
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
    const enrichmentContent = JSON.parse(enrichmentData.choices[0].message.content);

    // Content safety check
    if (containsInappropriateContent(generatedStory, bannedWords)) {
      throw new Error('Inappropriate content detected in generated story. Please try again.');
    }

    return new Response(
      JSON.stringify({ 
        story: generatedStory,
        enrichment: enrichmentContent
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
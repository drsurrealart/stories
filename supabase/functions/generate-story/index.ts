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

    // Validate character names
    if (preferences.characterName1 && containsInappropriateContent(preferences.characterName1, bannedWords)) {
      throw new Error('Inappropriate content detected in character name');
    }
    if (preferences.characterName2 && containsInappropriateContent(preferences.characterName2, bannedWords)) {
      throw new Error('Inappropriate content detected in character name');
    }

    // Create character names string if provided
    const characterNames = [preferences.characterName1, preferences.characterName2]
      .filter(Boolean)
      .map(name => name.trim())
      .filter(name => name.length > 0 && name.length <= 20)
      .join(" and ");
    
    const characterPrompt = characterNames 
      ? `Use the character names "${characterNames}" as the main characters in the story.`
      : "Create relatable characters with simple, natural names.";

    const lengthPrompt = preferences.lengthPreference === 'short' 
      ? "Keep the story brief and concise." 
      : preferences.lengthPreference === 'long' 
        ? "Make the story more detailed."
        : "Keep the story at a moderate length.";

    const tonePrompt = preferences.tone === 'standard' 
      ? "" 
      : `Make the story ${preferences.tone} in tone.`;

    const languagePrompt = preferences.language === 'english' 
      ? "" 
      : `Write the story in ${preferences.language}.`;

    const storyPrompt = `Create a ${preferences.genre} story for ${preferences.ageGroup} about ${preferences.moral}. 
${characterPrompt} ${lengthPrompt} ${tonePrompt} ${languagePrompt}

Important guidelines:
- Write clearly and directly
- Avoid unnecessary words and repetition
- Keep sentences focused and meaningful
- Use natural dialogue and descriptions
- Include a clear moral lesson at the end

Format:
- Start with a clear title
- Write the story in clear paragraphs
- End with "Moral: [the moral lesson]"
- Do not use decorative characters or "Title:" prefix
- Keep it family-friendly and age-appropriate`;

    // Generate the story
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
            content: 'You are a skilled storyteller who creates clear, engaging stories with meaningful moral lessons. Write concisely and avoid unnecessary words or repetition. Focus on natural dialogue and descriptions that move the story forward.',
          },
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.8,
      }),
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const storyData = await storyResponse.json();
    const generatedStory = storyData.choices[0].message.content;

    // Check generated content for inappropriate content
    if (containsInappropriateContent(generatedStory, bannedWords)) {
      throw new Error('Inappropriate content detected in generated story. Please try again.');
    }

    // Generate enrichment content
    const enrichmentPrompt = `Based on this story, generate 3 reflection questions, 3 action steps, and 3 discussion prompts that help readers understand and apply the moral lesson. Format the response as JSON with these keys: reflection_questions, action_steps, discussion_prompts.

Story:
${generatedStory}`;

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
      console.log("Successfully parsed enrichment content:", parsedEnrichment);
    } catch (error) {
      console.error("Error parsing enrichment content:", error);
      console.log("Raw enrichment content:", enrichmentData.choices[0].message.content);
      throw new Error('Failed to parse enrichment content');
    }

    return new Response(
      JSON.stringify({ 
        story: generatedStory,
        enrichment: {
          ...parsedEnrichment,
          related_quote: "" // Keep the structure but don't generate quotes
        }
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
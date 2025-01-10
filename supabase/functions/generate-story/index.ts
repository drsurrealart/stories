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

    console.log("Received preferences:", preferences);

    // Create character names string if provided
    const characterNames = [preferences.characterName1, preferences.characterName2]
      .filter(Boolean)
      .map(name => name.trim())
      .filter(name => name.length > 0 && name.length <= 20)
      .join(" and ");
    
    const characterPrompt = characterNames 
      ? `Use the character names "${characterNames}" as the main characters in the story. Make sure these characters play central roles in the narrative.`
      : "Create unique and memorable character names for the story. Avoid common or generic names. Each character should have a distinctive name that reflects their personality or role in the story.";

    // Add length preference to the prompt
    const lengthPrompt = preferences.lengthPreference === 'short' 
      ? "Keep the story concise and brief, about half the length of a regular story." 
      : preferences.lengthPreference === 'long' 
        ? "Make the story more detailed and longer than usual, about twice the length of a regular story."
        : "Keep the story at a moderate length.";

    // Add tone preference to the prompt
    const tonePrompt = preferences.tone === 'standard' 
      ? "" 
      : `Make the story ${preferences.tone} in tone and style.`;

    // Add language instruction
    const languagePrompt = preferences.language === 'english' 
      ? "" 
      : `Write the entire story in ${preferences.language}. Make sure to maintain proper grammar and natural flow in the target language.`;

    const prompt = `Create a ${preferences.genre} story for ${preferences.ageGroup} age group about ${preferences.moral}. ${characterPrompt} ${lengthPrompt} ${tonePrompt} ${languagePrompt} Format the story with a clear title at the start and a moral lesson at the end. The story should be engaging and end with a clear moral lesson. Make the characters and their interactions unique and memorable. If creating character names, ensure they are creative and distinctive. Keep it meaningful and family-friendly. Do not use asterisks or other decorative characters in the formatting. Do not start the title with "Title:". The story must be completely family-friendly and appropriate for children.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a skilled storyteller who creates engaging, age-appropriate stories with clear moral lessons. Create unique and memorable character names when no names are provided. Never reuse character names, plot elements, or titles from previous stories. Each story must be completely original with distinctive characters and creative names. Format the output with a Title at the start and a Moral at the end, without using any asterisks or decorative characters. Do not prefix the title with "Title:". The content must be completely family-friendly and appropriate for children.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.9,
        presence_penalty: 0.4,
        frequency_penalty: 0.4,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await openAIResponse.json();
    console.log("OpenAI response received");

    // Check generated content for inappropriate content
    const generatedStory = data.choices[0].message.content;
    if (containsInappropriateContent(generatedStory, bannedWords)) {
      throw new Error('Inappropriate content detected in generated story. Please try again.');
    }

    return new Response(
      JSON.stringify({ story: generatedStory }),
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

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    console.log('Received story preferences:', preferences);

    // Generate the story
    const storyPrompt = `Create a ${preferences.lengthPreference} length story for ${preferences.ageGroup} about ${preferences.moral}. 
    Genre: ${preferences.genre}
    Language: ${preferences.language}
    Tone: ${preferences.tone}
    Reading Level: ${preferences.readingLevel}
    ${preferences.characterName1 ? `Main character name: ${preferences.characterName1}` : ''}
    ${preferences.characterName2 ? `Secondary character name: ${preferences.characterName2}` : ''}

    The story should:
    1. Start with a clear title on the first line
    2. Include "Moral:" at the end
    3. Be engaging and appropriate for the age group
    4. Clearly demonstrate the moral lesson
    5. Use simple language for young children, or more complex language for older audiences
    6. Match the specified genre and tone`;

    console.log('Sending story generation request to OpenAI');
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
            content: 'You are a storyteller that creates engaging, age-appropriate stories with clear moral lessons. Write stories in plain text without any markdown formatting.',
          },
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
      }),
    });

    if (!storyResponse.ok) {
      throw new Error(`OpenAI API error: ${storyResponse.statusText}`);
    }

    const storyData = await storyResponse.json();
    const generatedStory = storyData.choices[0].message.content.replace(/\*\*/g, '');
    console.log('Story generated successfully');

    // Generate enrichment content with explicit JSON format instruction
    const enrichmentPrompt = `Generate enrichment content for this story in pure JSON format (no markdown, no backticks). The response should be a valid JSON object with these exact keys: reflection_questions (array of 3 strings), action_steps (array of 3 strings), related_quote (string), discussion_prompts (array of 3 strings).

Story:
${generatedStory}`;

    console.log('Sending enrichment generation request to OpenAI');
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
            content: 'You are a JSON generator that creates enrichment content for stories. Always respond with pure, valid JSON objects without any markdown formatting or explanation text.',
          },
          {
            role: 'user',
            content: enrichmentPrompt,
          },
        ],
      }),
    });

    if (!enrichmentResponse.ok) {
      throw new Error(`OpenAI API error: ${enrichmentResponse.statusText}`);
    }

    const enrichmentData = await enrichmentResponse.json();
    const enrichmentContent = enrichmentData.choices[0].message.content;
    console.log("Raw enrichment content:", enrichmentContent);

    let parsedEnrichment;
    try {
      // Clean the response if it contains any markdown artifacts
      const cleanedContent = enrichmentContent
        .replace(/```json\s*/, '')  // Remove opening markdown
        .replace(/```\s*$/, '')     // Remove closing markdown
        .trim();                    // Remove any extra whitespace
      
      parsedEnrichment = JSON.parse(cleanedContent);
      console.log("Successfully parsed enrichment content");
    } catch (error) {
      console.error("Error parsing enrichment content:", error);
      console.log("Attempted to parse content:", enrichmentContent);
      throw new Error('Failed to parse enrichment content');
    }

    return new Response(
      JSON.stringify({
        story: generatedStory,
        enrichment: parsedEnrichment,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
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

    // Apply default values for any missing advanced settings
    const fullPreferences = {
      lengthPreference: "medium",
      language: "english",
      tone: "standard",
      readingLevel: "intermediate",
      ...preferences
    };

    // Create a more detailed prompt if a profile is selected
    let profileContext = "";
    if (fullPreferences.selectedProfile) {
      const profile = fullPreferences.selectedProfile;
      profileContext = `
The main character should be based on this profile:
- Name: ${fullPreferences.useProfileName ? profile.name : "Choose an appropriate name"}
- Age: ${profile.age} years old
- Gender: ${profile.gender || "Not specified"}
- Physical appearance: ${profile.ethnicity ? `${profile.ethnicity} ethnicity` : ""} ${profile.hairColor ? `with ${profile.hairColor} hair` : ""}
- Interests: ${profile.interests.join(", ")}

Please incorporate these characteristics naturally into the story, making the character relatable and authentic.`;
    }

    // Generate the story
    const storyPrompt = `Create a ${fullPreferences.lengthPreference} length story for ${fullPreferences.ageGroup} about ${fullPreferences.moral}. 
    Genre: ${fullPreferences.genre}
    ${fullPreferences.language !== "english" ? `Language: ${fullPreferences.language}` : ''}
    ${fullPreferences.tone !== "standard" ? `Tone: ${fullPreferences.tone}` : ''}
    ${fullPreferences.readingLevel !== "intermediate" ? `Reading Level: ${fullPreferences.readingLevel}` : ''}
    ${fullPreferences.characterName1 ? `Main character name: ${fullPreferences.characterName1}` : ''}
    ${fullPreferences.characterName2 ? `Secondary character name: ${fullPreferences.characterName2}` : ''}
    ${profileContext}

    The story should:
    1. Start with a clear title on the first line (no markdown formatting)
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

    // Generate image prompt based on story and preferences, including profile details
    let imagePromptContext = "";
    if (fullPreferences.selectedProfile) {
      const profile = fullPreferences.selectedProfile;
      imagePromptContext = `The main character should be:
- ${profile.age} years old
- ${profile.gender || "any gender"}
- ${profile.ethnicity || "any ethnicity"} ethnicity
- ${profile.hairColor || "any"} hair color
Make sure these physical characteristics are accurately represented in the image.`;
    }

    const imagePromptRequest = `Create a concise, detailed image generation prompt for DALL-E based on this story and these parameters:
    Age group: ${fullPreferences.ageGroup}
    Genre: ${fullPreferences.genre}
    Tone: ${fullPreferences.tone}
    ${imagePromptContext}
    
    Story:
    ${generatedStory}
    
    Create a prompt that:
    1. Captures the main visual scene or character from the story
    2. Is appropriate for the age group
    3. Matches the genre and tone
    4. Is specific but concise (max 100 words)
    5. Includes artistic style guidance appropriate for children's illustration if it's for young audiences
    6. Only return the prompt itself, no explanations or additional text`;

    console.log('Generating image prompt');
    const imagePromptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert at creating clear, specific image generation prompts that capture the essence of stories while being appropriate for the target age group.',
          },
          {
            role: 'user',
            content: imagePromptRequest,
          },
        ],
      }),
    });

    if (!imagePromptResponse.ok) {
      throw new Error(`OpenAI API error: ${imagePromptResponse.statusText}`);
    }

    const imagePromptData = await imagePromptResponse.json();
    const imagePrompt = imagePromptData.choices[0].message.content.trim();
    console.log('Image prompt generated:', imagePrompt);

    // Generate enrichment content with explicit JSON format instruction
    const enrichmentPrompt = `Generate enrichment content for this story. Respond with a pure JSON object (no markdown) containing these exact keys: reflection_questions (array of 3 strings), action_steps (array of 3 strings), related_quote (string), discussion_prompts (array of 3 strings).

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
        imagePrompt: imagePrompt,
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
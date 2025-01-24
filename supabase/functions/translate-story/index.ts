import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, targetLanguage, userId } = await req.json();
    console.log(`Translating story ${storyId} to ${targetLanguage} for user ${userId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the original story
    const { data: originalStory, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;
    console.log('Original story fetched successfully');

    // Translate the story using OpenAI
    const translationPrompt = `Translate this story to ${targetLanguage}. Maintain the same tone, style, and meaning:
    Title: ${originalStory.title}
    Story: ${originalStory.content}
    Moral: ${originalStory.moral}`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given story to ${targetLanguage}, maintaining its original meaning, style, and emotional impact. Return the translation in this format:
            TITLE: [translated title]
            STORY: [translated story]
            MORAL: [translated moral]`,
          },
          {
            role: 'user',
            content: translationPrompt,
          },
        ],
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Translation failed');
    }

    const translationData = await openAIResponse.json();
    const translatedText = translationData.choices[0].message.content;
    console.log('Translation completed successfully');

    // Parse the translated text
    const titleMatch = translatedText.match(/TITLE:\s*(.*)/i);
    const storyMatch = translatedText.match(/STORY:\s*([\s\S]*?)(?=MORAL:)/i);
    const moralMatch = translatedText.match(/MORAL:\s*([\s\S]*$)/i);

    const translatedTitle = titleMatch?.[1].trim() || `${originalStory.title} (${targetLanguage})`;
    const translatedContent = storyMatch?.[1].trim() || '';
    const translatedMoral = moralMatch?.[1].trim() || '';

    // Insert the translated story
    const { data: translatedStory, error: insertError } = await supabase
      .from('stories')
      .insert({
        title: translatedTitle,
        content: translatedContent,
        moral: translatedMoral,
        author_id: userId,
        age_group: originalStory.age_group,
        genre: originalStory.genre,
        slug: `${originalStory.slug}-${targetLanguage}`,
        language: targetLanguage,
        tone: originalStory.tone,
        reading_level: originalStory.reading_level,
        length_preference: originalStory.length_preference,
        reflection_questions: originalStory.reflection_questions,
        action_steps: originalStory.action_steps,
        related_quote: originalStory.related_quote,
        discussion_prompts: originalStory.discussion_prompts,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('Translated story saved successfully');

    // Record the translation relationship
    const { error: translationError } = await supabase
      .from('story_translations')
      .insert({
        original_story_id: storyId,
        translated_story_id: translatedStory.id,
        language: targetLanguage,
        user_id: userId,
      });

    if (translationError) throw translationError;
    console.log('Translation relationship recorded');

    // Update credits
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { error: creditError } = await supabase
      .from('user_story_counts')
      .upsert({
        user_id: userId,
        month_year: currentMonth,
        credits_used: 1
      }, {
        onConflict: 'user_id,month_year'
      });

    if (creditError) throw creditError;
    console.log('Credits updated successfully');

    return new Response(
      JSON.stringify({ success: true, translatedStory }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in translate-story function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
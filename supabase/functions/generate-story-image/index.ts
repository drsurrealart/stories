import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, selectedProfile, style = "realistic" } = await req.json()

    // Style-specific prompt enhancements
    const stylePrompts = {
      realistic: "Create a photorealistic image with natural lighting and detailed textures.",
      watercolor: "Create a soft, artistic watercolor painting with gentle brush strokes and flowing colors.",
      cartoon: "Create a vibrant cartoon illustration with bold lines and playful colors.",
      "3d": "Create a modern 3D rendered scene with depth and dimensional lighting.",
      storybook: "Create a classic children's book illustration with warm, inviting colors.",
      fantasy: "Create a magical fantasy art piece with ethereal lighting and mystical elements."
    };

    // Enhance prompt with profile details if available
    let enhancedPrompt = prompt
    if (selectedProfile) {
      const { name, age, gender, ethnicity, hairColor, interests } = selectedProfile
      
      // Create a description of the character based on profile
      const characterDescription = [
        `a ${age} year old`,
        gender ? `${gender}` : '',
        ethnicity ? `${ethnicity}` : '',
        'child',
        hairColor ? `with ${hairColor} hair` : '',
        'as the main character.',
        interests?.length ? `They enjoy ${interests.join(', ')}.` : ''
      ].filter(Boolean).join(' ')

      // Combine with original prompt and style
      enhancedPrompt = `Create a high-quality, detailed illustration featuring ${characterDescription} The scene: ${prompt}. ${stylePrompts[style as keyof typeof stylePrompts]} The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Important: Do not include any text or words in the image.`
    } else {
      // Use standard prompt enhancement with style
      enhancedPrompt = `Create a high-quality, detailed illustration. ${stylePrompts[style as keyof typeof stylePrompts]} The scene: ${prompt}. The image should be engaging and magical, without any text overlays. Focus on creating an emotional and immersive scene. Important: Do not include any text or words in the image.`
    }

    // Call OpenAI API to generate image
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate image')
    }

    return new Response(
      JSON.stringify({ imageUrl: data.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
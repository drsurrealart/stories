import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, userId } = await req.json();
    console.log('Generating enhanced PDF for story:', storyId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch complete story data including enrichment content
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Fetch story image if it exists
    const { data: storyImage } = await supabase
      .from('story_images')
      .select('image_url')
      .eq('story_id', storyId)
      .eq('user_id', userId)
      .maybeSingle();

    // Create PDF
    const doc = new jsPDF();
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    doc.setFontSize(24);
    doc.text(story.title, pageWidth / 2, 20, { align: 'center' });

    let y = 40;

    // Add story image if it exists right after the title
    if (storyImage?.image_url) {
      try {
        const imageResponse = await fetch(storyImage.image_url);
        const imageBlob = await imageResponse.blob();
        const imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageBlob);
        });

        const imgWidth = 170;
        const imgHeight = 170;
        const xOffset = (pageWidth - imgWidth) / 2;
        
        doc.addImage(
          imageBase64 as string,
          'PNG',
          xOffset,
          y,
          imgWidth,
          imgHeight
        );
        
        y += imgHeight + 20; // Add space after image
      } catch (imageError) {
        console.error('Error adding image to PDF:', imageError);
      }
    }

    // Add metadata (age group, genre, etc.)
    doc.setFontSize(12);
    doc.setFont(undefined, 'italic');
    const metadata = [
      `Age Group: ${story.age_group}`,
      `Genre: ${story.genre}`,
      story.language !== 'english' && `Language: ${story.language}`,
      story.tone !== 'standard' && `Tone: ${story.tone}`,
      story.reading_level !== 'intermediate' && `Reading Level: ${story.reading_level}`,
      story.length_preference !== 'medium' && `Length: ${story.length_preference}`,
    ].filter(Boolean);

    metadata.forEach(item => {
      doc.text(item, margin, y);
      y += lineHeight;
    });

    y += lineHeight;

    // Add story content
    doc.setFont(undefined, 'normal');
    const splitContent = doc.splitTextToSize(story.content, maxWidth);
    splitContent.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Add moral if exists
    if (story.moral) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += lineHeight;
      doc.setFontSize(16);
      doc.text('Moral:', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      const splitMoral = doc.splitTextToSize(story.moral, maxWidth);
      splitMoral.forEach(line => {
        doc.text(line, margin, y);
        y += lineHeight;
      });
    }

    // Add reflection questions if they exist
    if (story.reflection_questions?.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += lineHeight;
      doc.setFontSize(16);
      doc.text('Reflection Questions:', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      story.reflection_questions.forEach((question, index) => {
        const splitQuestion = doc.splitTextToSize(`${index + 1}. ${question}`, maxWidth);
        splitQuestion.forEach(line => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
    }

    // Add action steps if they exist
    if (story.action_steps?.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += lineHeight;
      doc.setFontSize(16);
      doc.text('Action Steps:', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      story.action_steps.forEach((step, index) => {
        const splitStep = doc.splitTextToSize(`${index + 1}. ${step}`, maxWidth);
        splitStep.forEach(line => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
    }

    // Add discussion prompts if they exist
    if (story.discussion_prompts?.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += lineHeight;
      doc.setFontSize(16);
      doc.text('Discussion Prompts:', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      story.discussion_prompts.forEach((prompt, index) => {
        const splitPrompt = doc.splitTextToSize(`${index + 1}. ${prompt}`, maxWidth);
        splitPrompt.forEach(line => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
    }

    // Convert to buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Upload to Supabase Storage
    const timestamp = new Date().getTime();
    const filePath = `${userId}/${storyId}_${timestamp}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('story-pdfs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrl } = supabase
      .storage
      .from('story-pdfs')
      .getPublicUrl(filePath);

    // Save PDF record
    const { error: saveError } = await supabase
      .from('story_pdfs')
      .insert({
        story_id: storyId,
        user_id: userId,
        pdf_url: publicUrl.publicUrl,
        credits_used: 1
      });

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ url: publicUrl.publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
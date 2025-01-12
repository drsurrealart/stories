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
    console.log('Generating PDF for story:', storyId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch story data
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Create PDF
    const doc = new jsPDF();
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    doc.setFontSize(24);
    doc.text(story.title, pageWidth / 2, 20, { align: 'center' });

    // Add content
    doc.setFontSize(12);
    let y = 40;

    // Split content into lines that fit the page width
    const splitContent = doc.splitTextToSize(story.content, maxWidth);
    splitContent.forEach(line => {
      if (y > 280) { // Check if we need a new page
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Add moral if exists
    if (story.moral) {
      if (y > 250) { // Check if we need a new page
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
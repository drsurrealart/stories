import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import PDFDocument from 'https://cdn.skypack.dev/pdfkit';
import { Buffer } from "https://deno.land/std@0.168.0/node/buffer.ts";

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
      .select(`
        *,
        story_images (
          image_url
        )
      `)
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    // Create PDF
    const doc = new PDFDocument();
    let buffers: Uint8Array[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));

    // Add content to PDF
    doc.fontSize(24).text(story.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(story.content);
    
    if (story.moral) {
      doc.moveDown();
      doc.fontSize(16).text('Moral:', { underline: true });
      doc.fontSize(12).text(story.moral);
    }

    if (story.reflection_questions) {
      doc.moveDown();
      doc.fontSize(16).text('Reflection Questions:', { underline: true });
      story.reflection_questions.forEach((question: string, index: number) => {
        doc.fontSize(12).text(`${index + 1}. ${question}`);
      });
    }

    if (story.action_steps) {
      doc.moveDown();
      doc.fontSize(16).text('Action Steps:', { underline: true });
      story.action_steps.forEach((step: string, index: number) => {
        doc.fontSize(12).text(`${index + 1}. ${step}`);
      });
    }

    if (story.related_quote) {
      doc.moveDown();
      doc.fontSize(16).text('Related Quote:', { underline: true });
      doc.fontSize(12).text(story.related_quote);
    }

    if (story.discussion_prompts) {
      doc.moveDown();
      doc.fontSize(16).text('Discussion Prompts:', { underline: true });
      story.discussion_prompts.forEach((prompt: string, index: number) => {
        doc.fontSize(12).text(`${index + 1}. ${prompt}`);
      });
    }

    // Finalize PDF
    doc.end();

    // Convert to single buffer
    const pdfBuffer = Buffer.concat(buffers);

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
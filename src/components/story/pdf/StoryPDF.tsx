import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StoryPDFProps {
  storyId: string;
  storyContent: string;
}

export function StoryPDF({ storyId }: StoryPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  // Fetch existing PDF if any
  const { data: pdfData, refetch: refetchPDF } = useQuery({
    queryKey: ['story-pdf', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('story_pdfs')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate PDFs.",
          variant: "destructive",
        });
        return;
      }

      // Update credits before generating PDF
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { error: creditError } = await supabase
        .from('user_story_counts')
        .upsert({
          user_id: session.user.id,
          month_year: currentMonth,
          credits_used: 1
        }, {
          onConflict: 'user_id,month_year'
        });

      if (creditError) {
        throw new Error('Failed to update credits');
      }

      const response = await supabase.functions.invoke('generate-story-pdf', {
        body: { storyId, userId: session.user.id }
      });

      if (response.error) throw response.error;

      // Refetch PDF data after successful generation
      await refetchPDF();

      toast({
        title: "Success",
        description: "PDF generated successfully!",
      });

    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setShowConfirm(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Printable Story</h3>
      </div>

      {!pdfData ? (
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            "Generating PDF..."
          ) : (
            <>Create Printable Story (Uses 1 Credit)</>
          )}
        </Button>
      ) : (
        <Button
          onClick={() => window.open(pdfData.pdf_url, '_blank')}
          className="w-full"
          variant="secondary"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download Story PDF
        </Button>
      )}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate PDF</AlertDialogTitle>
            <AlertDialogDescription>
              This will use 1 credit to generate a printable PDF version of your story.
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGeneratePDF} disabled={isGenerating}>
              Generate PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
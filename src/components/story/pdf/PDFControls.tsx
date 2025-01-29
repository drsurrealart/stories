import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Trash2, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteMediaDialog } from "../media/DeleteMediaDialog";
import { ShareMediaDialog } from "../media/ShareMediaDialog";

interface PDFControlsProps {
  storyId: string;
  pdfUrl: string;
}

export function PDFControls({ storyId, pdfUrl }: PDFControlsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      const { data } = supabase.storage.from('story-pdfs').getPublicUrl(pdfUrl);
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = `story-${storyId}-document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your PDF is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async () => {
    try {
      const { data } = supabase.storage.from('story-pdfs').getPublicUrl(pdfUrl);
      window.open(data.publicUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open PDF for printing",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete from storage
      const fileName = pdfUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('story-pdfs')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('story_pdfs')
        .delete()
        .eq('story_id', storyId);

      if (dbError) throw dbError;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['story-pdf', storyId] });

      toast({
        title: "Success",
        description: "Story PDF deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting story PDF:", error);
      toast({
        title: "Error",
        description: "Failed to delete story PDF",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const { data: publicUrl } = supabase.storage.from('story-pdfs').getPublicUrl(pdfUrl);

  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download
        </Button>
        <ShareMediaDialog 
          title="Story PDF"
          url={publicUrl.publicUrl}
          type="pdf"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center gap-2 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="h-4 w-4" />
        Delete PDF
      </Button>

      <DeleteMediaDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Story PDF"
        description="Are you sure you want to delete this story PDF? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
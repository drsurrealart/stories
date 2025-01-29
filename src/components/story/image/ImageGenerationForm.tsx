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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ImageGenerationFormProps {
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: () => void;
  creditCost?: number;
}

export function ImageGenerationForm({
  isGenerating,
  showConfirmDialog,
  onConfirmDialogChange,
  onGenerate,
  creditCost = 5,
}: ImageGenerationFormProps) {
  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={() => onConfirmDialogChange(true)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating... please wait</span>
          </div>
        ) : (
          <>Create Story Images (Uses {creditCost} Credits)</>
        )}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={onConfirmDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Story Images</AlertDialogTitle>
            <AlertDialogDescription>
              This will use {creditCost} credits from your account. The AI will generate two images that match your story's content - one in 16:9 format for display and one in 9:16 format for video creation. Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onGenerate}>Generate Images</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
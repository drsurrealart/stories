
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
import { ImageStyleSelector } from "./ImageStyleSelector";
import { useState } from "react";

interface ImageGenerationFormProps {
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: (style: string, aspectRatio?: string) => void;
  creditCost?: number;
}

export function ImageGenerationForm({
  isGenerating,
  showConfirmDialog,
  onConfirmDialogChange,
  onGenerate,
  creditCost = 5,
}: ImageGenerationFormProps) {
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");

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
              This will use {creditCost} credits from your account. The AI will generate an image that matches your story's content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <ImageStyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              disabled={isGenerating}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Aspect Ratio</label>
              <div className="flex gap-2">
                <Button
                  variant={selectedAspectRatio === "16:9" ? "default" : "outline"}
                  onClick={() => setSelectedAspectRatio("16:9")}
                  className="flex-1"
                >
                  Landscape (16:9)
                </Button>
                <Button
                  variant={selectedAspectRatio === "9:16" ? "default" : "outline"}
                  onClick={() => setSelectedAspectRatio("9:16")}
                  className="flex-1"
                >
                  Portrait (9:16)
                </Button>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onGenerate(selectedStyle, selectedAspectRatio)}>
              Generate Images
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

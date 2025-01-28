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
import { Loader2, Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type VideoAspectRatio = "16:9" | "9:16";

interface VideoGenerationFormProps {
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: (aspectRatio: VideoAspectRatio) => void;
  creditCost?: number;
}

export function VideoGenerationForm({
  isGenerating,
  showConfirmDialog,
  onConfirmDialogChange,
  onGenerate,
  creditCost = 10,
}: VideoGenerationFormProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Create Story Video</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Transform your story into an engaging video with custom background and audio narration.
        </p>

        <Button
          className="w-full"
          onClick={() => onConfirmDialogChange(true)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating video... please wait</span>
            </div>
          ) : (
            <>Create Story Video (Uses {creditCost} Credits)</>
          )}
        </Button>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={onConfirmDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Story Video</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>This will use {creditCost} credits from your account to create a video that combines:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>AI-generated background visuals</li>
                <li>Audio narration of your story</li>
                <li>Professional video composition</li>
              </ul>
              <p className="mt-4 font-medium">Choose your preferred aspect ratio:</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select onValueChange={(value: VideoAspectRatio) => onGenerate(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">
                  <div className="flex flex-col">
                    <span>Landscape (16:9)</span>
                    <span className="text-sm text-muted-foreground">Best for YouTube, Desktop</span>
                  </div>
                </SelectItem>
                <SelectItem value="9:16">
                  <div className="flex flex-col">
                    <span>Portrait (9:16)</span>
                    <span className="text-sm text-muted-foreground">Best for Stories, TikTok</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
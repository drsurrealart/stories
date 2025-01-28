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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";

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
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<VideoAspectRatio | ''>('');

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
            <span>Generating video... please wait</span>
          </div>
        ) : (
          <>Create Story Video (Uses {creditCost} Credits)</>
        )}
      </Button>

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
              <div className="mt-6">
                <p className="font-medium mb-2">Choose your preferred aspect ratio:</p>
                <Select 
                  value={selectedAspectRatio} 
                  onValueChange={(value: VideoAspectRatio) => setSelectedAspectRatio(value)}
                >
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              onClick={() => selectedAspectRatio && onGenerate(selectedAspectRatio)}
              disabled={!selectedAspectRatio || isGenerating}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Generate Video
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
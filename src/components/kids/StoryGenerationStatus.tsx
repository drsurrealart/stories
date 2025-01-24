import { Loader2 } from "lucide-react";

interface StoryGenerationStatusProps {
  isGenerating: boolean;
  generationStep: string;
}

export function StoryGenerationStatus({ isGenerating, generationStep }: StoryGenerationStatusProps) {
  if (!isGenerating) return null;

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{generationStep || "Creating your story..."}</span>
      </div>
    </div>
  );
}
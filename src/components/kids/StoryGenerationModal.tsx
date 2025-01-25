import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Star, Wand2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryGenerationModalProps {
  isOpen: boolean;
  generationStep: string;
}

const getPositiveMessage = (step: string) => {
  switch (step) {
    case "Creating your magical story...":
      return "Every story is special, just like you!";
    case "Saving your story...":
      return "Good things take time...";
    case "Creating beautiful pictures...":
      return "Magic is happening...";
    case "Adding storyteller's voice...":
      return "Your story is on its way!";
    default:
      return "Creating something wonderful...";
  }
};

export function StoryGenerationModal({ isOpen, generationStep }: StoryGenerationModalProps) {
  // Return null if not open to ensure proper cleanup
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="sm:max-w-md bg-gradient-to-b from-secondary to-background border-4 border-primary"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click during generation
      >
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          {/* Animated Icons */}
          <div className="relative w-24 h-24">
            <Wand2 className={cn(
              "w-12 h-12 absolute top-0 left-0 text-primary animate-bounce",
              "transition-all duration-500"
            )} />
            <Star className={cn(
              "w-12 h-12 absolute top-0 right-0 text-primary animate-pulse",
              "transition-all duration-500"
            )} />
            <Heart className={cn(
              "w-12 h-12 absolute bottom-0 left-0 text-primary animate-bounce",
              "transition-all duration-500 delay-300"
            )} />
            <Loader2 className={cn(
              "w-12 h-12 absolute bottom-0 right-0 text-primary animate-spin",
              "transition-all duration-500 delay-300"
            )} />
          </div>

          {/* Generation Step */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-primary animate-fade-in">
              {generationStep}
            </h3>
            <p className="text-lg text-story-text animate-fade-in">
              {getPositiveMessage(generationStep)}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full max-w-xs bg-white rounded-full h-2 overflow-hidden">
            <div className="h-full bg-primary animate-pulse rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
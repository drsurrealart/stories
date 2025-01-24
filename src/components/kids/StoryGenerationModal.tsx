import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Star, Wand2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface StoryGenerationModalProps {
  isOpen: boolean;
  generationStep: string;
}

const positiveMessages = [
  "Good things take time...",
  "Patience is a superpower!",
  "Every story is special, just like you!",
  "Magic is happening...",
  "Creating something wonderful...",
  "Your story is on its way!",
];

export function StoryGenerationModal({ isOpen, generationStep }: StoryGenerationModalProps) {
  const [currentMessage, setCurrentMessage] = useState(positiveMessages[0]);

  useEffect(() => {
    if (!isOpen) return;

    // Change message every 5 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * positiveMessages.length);
      setCurrentMessage(positiveMessages[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-secondary to-background border-4 border-primary">
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
            <p 
              className={cn(
                "text-lg text-story-text transition-opacity duration-1000",
                "opacity-0 animate-fade-in delay-300"
              )}
            >
              {currentMessage}
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
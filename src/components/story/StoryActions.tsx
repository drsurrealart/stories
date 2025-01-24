import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryActionsProps {
  onReflect: () => void;
  onCreateNew: () => void;
  isKidsMode?: boolean;
}

export function StoryActions({ onReflect, onCreateNew, isKidsMode = false }: StoryActionsProps) {
  const navigate = useNavigate();

  if (isKidsMode) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onCreateNew} 
          size="lg"
          className="flex-1 h-16 text-lg font-bold animate-pulse bg-primary hover:bg-primary/90"
        >
          <BookOpen className="w-6 h-6 mr-3" />
          Create Another Story
        </Button>
        <Button 
          onClick={() => navigate('/your-stories')} 
          variant="secondary"
          size="lg"
          className="flex-1 h-16 text-lg"
        >
          View My Stories
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button onClick={onCreateNew} className="flex-1">
        <BookOpen className="w-4 h-4 mr-2" />
        Create Another Story
      </Button>
      <Button 
        onClick={() => navigate('/your-stories')} 
        variant="secondary"
        className="flex-1"
      >
        View My Stories
      </Button>
      <Button onClick={onReflect} className="flex-1">
        Reflect on Story
      </Button>
    </div>
  );
}
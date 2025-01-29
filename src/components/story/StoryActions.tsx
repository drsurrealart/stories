import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface StoryActionsProps {
  onCreateNew: () => void;
  isKidsMode?: boolean;
}

export function StoryActions({ onCreateNew, isKidsMode }: StoryActionsProps) {
  if (!isKidsMode) {
    return (
      <div className="flex flex-wrap gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Another
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl mx-auto mt-8">
      <Button
        variant="default"
        size="lg"
        onClick={onCreateNew}
        className="h-20 text-xl rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
      >
        <Plus className="h-8 w-8 mr-2" />
        Create New Story
      </Button>
      
      <Link to="/your-stories" className="flex-1">
        <Button
          variant="default"
          size="lg"
          className="w-full h-20 text-xl rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <BookOpen className="h-8 w-8 mr-2" />
          View My Stories
        </Button>
      </Link>
    </div>
  );
}
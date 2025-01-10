import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryActionsProps {
  onReflect: () => void;
  onCreateNew: () => void;
}

export function StoryActions({ onReflect, onCreateNew }: StoryActionsProps) {
  const navigate = useNavigate();

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
        <MessageCircle className="w-4 h-4 mr-2" />
        Reflect on Story
      </Button>
    </div>
  );
}
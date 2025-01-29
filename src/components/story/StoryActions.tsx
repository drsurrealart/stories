import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface StoryActionsProps {
  onReflect: () => void;
  onCreateNew: () => void;
  isKidsMode?: boolean;
}

export function StoryActions({ onReflect, onCreateNew, isKidsMode }: StoryActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <Button
        variant="destructive"
        size="sm"
        onClick={onReflect}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onCreateNew}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {isKidsMode ? "New Story" : "Create Another"}
      </Button>
    </div>
  );
}
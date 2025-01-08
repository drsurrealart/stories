import { Button } from "@/components/ui/button";
import { BookmarkPlus, MessageCircle } from "lucide-react";

interface StoryActionsProps {
  onSave: () => void;
  onReflect: () => void;
  isSaving: boolean;
}

export function StoryActions({ onSave, onReflect, isSaving }: StoryActionsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button onClick={onSave} className="flex-1 md:flex-none" disabled={isSaving}>
        <BookmarkPlus className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save Story"}
      </Button>
      <Button onClick={onReflect} className="flex-1">
        <MessageCircle className="w-4 h-4 mr-2" />
        Reflect on the Story
      </Button>
    </div>
  );
}
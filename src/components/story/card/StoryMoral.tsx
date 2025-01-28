import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface StoryMoralProps {
  moral: string;
}

export function StoryMoral({ moral }: StoryMoralProps) {
  if (!moral) return null;
  
  return (
    <Card className="bg-secondary p-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Moral</h3>
      </div>
      <p className="text-story-text">{moral}</p>
    </Card>
  );
}
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useState } from "react";

interface StoryProps {
  content: string;
  onReflect: () => void;
}

export function Story({ content, onReflect }: StoryProps) {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);

  return (
    <Card className="w-full max-w-2xl p-8 space-y-6 animate-fade-in bg-story-background">
      <div className="prose max-w-none">
        <div className="text-story-text leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">How was this story?</div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback("liked")}
              className={feedback === "liked" ? "bg-primary text-white" : ""}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback("disliked")}
              className={feedback === "disliked" ? "bg-destructive text-white" : ""}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Dislike
            </Button>
          </div>
        </div>

        <Button onClick={onReflect} className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Reflect on the Story
        </Button>
      </div>
    </Card>
  );
}
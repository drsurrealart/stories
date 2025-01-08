import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface StoryFeedbackProps {
  feedback: "liked" | "disliked" | null;
  onFeedback: (type: "liked" | "disliked") => void;
}

export function StoryFeedback({ feedback, onFeedback }: StoryFeedbackProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div className="text-sm text-gray-500">How was this story?</div>
      <div className="flex space-x-2 w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFeedback("liked")}
          className={`flex-1 md:flex-none ${feedback === "liked" ? "bg-primary text-white" : ""}`}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Like
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFeedback("disliked")}
          className={`flex-1 md:flex-none ${feedback === "disliked" ? "bg-destructive text-white" : ""}`}
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          Dislike
        </Button>
      </div>
    </div>
  );
}
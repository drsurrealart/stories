import { Book, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function StoriesHeader() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 text-center max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-2">
        <Book className="h-8 w-8 text-primary animate-bounce" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
          My Stories
        </h1>
        <BookOpen className="h-8 w-8 text-primary animate-bounce" />
      </div>
      <p className="text-lg text-muted-foreground">
        Your personal collection of magical stories that inspire and delight.
      </p>
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/stories-list')}
          className="flex items-center gap-2"
        >
          View Stories List
        </Button>
      </div>
    </div>
  );
}
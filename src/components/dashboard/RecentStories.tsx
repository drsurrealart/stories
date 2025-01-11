import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Story {
  id: string;
  title: string;
  created_at: string;
}

interface RecentStoriesProps {
  stories?: Story[];
  isLoading?: boolean;
}

export const RecentStories = ({ stories, isLoading }: RecentStoriesProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <History className="w-5 h-5" />
        Recent Stories
      </h2>
      <div className="space-y-3">
        {stories && stories.length > 0 ? (
          stories.map((story) => (
            <div 
              key={story.id} 
              className="p-3 bg-story-background rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
              onClick={() => navigate('/your-stories')}
            >
              <p className="font-medium text-story-text truncate">
                {story.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            No stories created yet. Start creating!
          </p>
        )}
      </div>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { History, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  age_group?: string;
  genre?: string;
  reading_level?: string;
  length_preference?: string;
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
      <div className="space-y-4">
        {stories && stories.length > 0 ? (
          stories.map((story) => (
            <div 
              key={story.id} 
              className="p-4 bg-story-background rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
              onClick={() => navigate('/your-stories')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-story-text">
                  {story.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {story.content}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {story.age_group && (
                  <Badge variant="secondary" className="capitalize">
                    {story.age_group}
                  </Badge>
                )}
                {story.genre && (
                  <Badge variant="secondary" className="capitalize">
                    {story.genre}
                  </Badge>
                )}
                {story.reading_level && story.reading_level !== "intermediate" && (
                  <Badge variant="secondary" className="capitalize">
                    {story.reading_level} level
                  </Badge>
                )}
                {story.length_preference && story.length_preference !== "medium" && (
                  <Badge variant="secondary" className="capitalize">
                    {story.length_preference} length
                  </Badge>
                )}
              </div>
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
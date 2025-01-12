import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Lightbulb, BookOpen, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StorySocialShare } from "@/components/story/StorySocialShare";
import { StoryEnrichment } from "@/components/story/StoryEnrichment";
import { FavoriteButton } from "@/components/story/FavoriteButton";
import { AudioStory } from "@/components/story/AudioStory";
import { StoryImage } from "@/components/story/image/StoryImage";
import { StoryPDF } from "@/components/story/pdf/StoryPDF";
import { SavedStory } from "@/types/story";
import { formatDate } from "@/utils/date";

interface StoryCardProps {
  story: SavedStory;
  onDelete: (id: string) => void;
}

export const StoryCard = ({ story, onDelete }: StoryCardProps) => {
  return (
    <Card key={story.id} className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
          <p className="text-sm text-gray-500 mb-4">
            Saved on {formatDate(story.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton storyId={story.id} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(story.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="prose max-w-none">
        <div className="text-story-text whitespace-pre-wrap">
          {story.content}
        </div>
      </div>
      {story.moral && (
        <Card className="bg-secondary p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Moral</h3>
          </div>
          <p className="text-story-text">{story.moral}</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {story.age_group && (
          <Badge variant="secondary" className="capitalize">
            <BookOpen className="h-3 w-3 mr-1" />
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
            <GraduationCap className="h-3 w-3 mr-1" />
            {story.reading_level} level
          </Badge>
        )}
        {story.length_preference && story.length_preference !== "medium" && (
          <Badge variant="secondary" className="capitalize">
            <Clock className="h-3 w-3 mr-1" />
            {story.length_preference} length
          </Badge>
        )}
        {story.language && story.language !== "english" && (
          <Badge variant="secondary" className="capitalize">
            {story.language}
          </Badge>
        )}
        {story.tone && story.tone !== "standard" && (
          <Badge variant="secondary" className="capitalize">
            {story.tone}
          </Badge>
        )}
      </div>

      {story.reflection_questions && (
        <StoryEnrichment
          reflectionQuestions={story.reflection_questions as string[]}
          actionSteps={story.action_steps as string[]}
          relatedQuote={story.related_quote || ''}
          discussionPrompts={story.discussion_prompts as string[]}
        />
      )}

      <AudioStory 
        storyId={story.id}
        storyContent={story.content}
      />

      <StoryImage 
        storyId={story.id}
        storyContent={story.content}
      />

      <StoryPDF 
        storyId={story.id}
        storyContent={story.content}
      />

      <div className="pt-4 border-t">
        <StorySocialShare
          title={story.title}
          content={story.content}
          moral={story.moral}
          url={window.location.href}
        />
      </div>
    </Card>
  );
};
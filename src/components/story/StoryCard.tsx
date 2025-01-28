import { Card } from "@/components/ui/card";
import { StorySocialShare } from "@/components/story/StorySocialShare";
import { StoryEnrichment } from "@/components/story/StoryEnrichment";
import { AudioStory } from "@/components/story/AudioStory";
import { StoryImage } from "@/components/story/image/StoryImage";
import { StoryPDF } from "@/components/story/pdf/StoryPDF";
import { StoryTranslation } from "@/components/story/translation/StoryTranslation";
import { StoryVideo } from "@/components/story/video/StoryVideo";
import { SavedStory } from "@/types/story";
import { StoryHeader } from "./card/StoryHeader";
import { StoryMeta } from "./card/StoryMeta";
import { StoryMoral } from "./card/StoryMoral";

interface StoryCardProps {
  story: SavedStory;
  onDelete: (id: string) => void;
}

export const StoryCard = ({ story, onDelete }: StoryCardProps) => {
  return (
    <Card key={story.id} className="p-6 space-y-4">
      <StoryHeader
        title={story.title}
        createdAt={story.created_at}
        storyId={story.id}
        onDelete={onDelete}
      />

      <div className="prose max-w-none">
        <div className="text-story-text whitespace-pre-wrap">
          {story.content}
        </div>
      </div>

      <StoryMoral moral={story.moral} />

      <StoryMeta
        ageGroup={story.age_group}
        genre={story.genre}
        readingLevel={story.reading_level}
        lengthPreference={story.length_preference}
        language={story.language}
        tone={story.tone}
      />

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

      <StoryVideo 
        storyId={story.id}
        storyContent={story.content}
      />

      <StoryPDF 
        storyId={story.id}
        storyContent={story.content}
      />

      <StoryTranslation 
        storyId={story.id}
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
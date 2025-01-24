import { StoryCard } from "@/components/story/StoryCard";
import { SavedStory } from "@/types/story";
import { Loading } from "@/components/ui/loading";

interface StoriesListProps {
  stories: SavedStory[];
  isLoading: boolean;
  searchQuery: string;
  highlightedStoryId: string | null;
  storyRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onDelete: (id: string) => void;
}

export function StoriesList({
  stories,
  isLoading,
  searchQuery,
  highlightedStoryId,
  storyRefs,
  onDelete,
}: StoriesListProps) {
  if (isLoading) {
    return <Loading text="Loading your stories..." />;
  }

  if (stories.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4 bg-white/50 rounded-lg">
        {searchQuery ? "No stories found matching your search." : "You haven't saved any stories yet."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <div
          key={story.id}
          ref={el => storyRefs.current[story.id] = el}
          className={`transition-all duration-300 ${
            highlightedStoryId === story.id ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''
          }`}
        >
          <StoryCard 
            story={story}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
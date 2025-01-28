import { useState } from "react";
import { StoryCreatorLayout } from "@/components/kids/StoryCreatorLayout";
import { StoryCreatorHeader } from "@/components/kids/StoryCreatorHeader";
import { StoryGenerator } from "@/components/kids/StoryGenerator";
import { StoryGenerationHandler } from "@/components/kids/StoryGenerationHandler";

export default function KidsStoryCreator() {
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const handleCreateNew = () => {
    setGeneratedStory(null);
  };

  return (
    <StoryCreatorLayout>
      {!generatedStory ? (
        <div className="space-y-8">
          <StoryCreatorHeader />
          <StoryGenerator onStoryGenerated={setGeneratedStory} />
        </div>
      ) : (
        <StoryGenerationHandler
          generatedStory={generatedStory}
          handleCreateNew={handleCreateNew}
        />
      )}
    </StoryCreatorLayout>
  );
}
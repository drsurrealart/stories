import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/components/Story";
import { StoryCreatorHeader } from "@/components/kids/StoryCreatorHeader";
import { StoryGenerationStatus } from "@/components/kids/StoryGenerationStatus";
import { GenerateStoryButton } from "@/components/kids/GenerateStoryButton";
import { ConfirmationDialog } from "@/components/kids/ConfirmationDialog";
import { StoryGenerationModal } from "@/components/kids/StoryGenerationModal";
import { StoryCreatorLayout } from "@/components/kids/StoryCreatorLayout";
import { StoryCreatorSteps } from "@/components/kids/StoryCreatorSteps";
import { AgeGroupTabs } from "@/components/kids/AgeGroupTabs";

// Map kids age groups to database age groups
const AGE_GROUP_MAPPING = {
  '5-7': 'preschool',
  '8-10': 'elementary',
  '11-12': 'tween'
};

const KidsStoryCreator = () => {
  const [ageGroup, setAgeGroup] = useState("");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const { toast } = useToast();

  const resetStates = () => {
    setIsGenerating(false);
    setGenerationStep("");
    setShowConfirmDialog(false);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to create stories",
          variant: "destructive",
        });
        resetStates();
        return;
      }

      // Map the selected age group to the database format
      const mappedAgeGroup = AGE_GROUP_MAPPING[ageGroup as keyof typeof AGE_GROUP_MAPPING];

      // Step 1: Generate Story Text
      setGenerationStep("Creating your magical story...");
      const storyResponse = await supabase.functions.invoke('generate-story', {
        body: {
          preferences: {
            ageGroup: mappedAgeGroup,
            genre: storyType,
            moral: "being kind and helpful",
            lengthPreference: "short",
            language: "english",
            tone: "funny",
            readingLevel: "early_reader"
          }
        }
      });

      if (storyResponse.error) throw new Error(storyResponse.error.message);
      const story = storyResponse.data.story;
      const imagePrompt = storyResponse.data.imagePrompt;

      // Create a URL-friendly slug from the title
      const title = story.split('\n')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Save the story first
      setGenerationStep("Saving your story...");
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title: title,
          content: story,
          age_group: mappedAgeGroup,
          genre: storyType,
          moral: "being kind and helpful",
          author_id: session.user.id,
          image_prompt: imagePrompt,
          slug: slug,
          poetic_style: "prose",
          reading_level: "early_reader",
          language: "english",
          tone: "funny",
          length_preference: "short"
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Step 2: Generate Image
      setGenerationStep("Creating beautiful pictures...");
      const imageResponse = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: imagePrompt }
      });

      if (imageResponse.error) throw new Error(imageResponse.error.message);

      // Save the image
      if (imageResponse.data?.imageUrl) {
        await supabase
          .from('story_images')
          .insert({
            story_id: savedStory.id,
            user_id: session.user.id,
            image_url: imageResponse.data.imageUrl,
            credits_used: 5
          });
      }

      // Step 3: Generate Audio
      setGenerationStep("Adding storyteller's voice...");
      const audioResponse = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: story,
          voice: "fable"
        }
      });

      if (audioResponse.error) throw new Error(audioResponse.error.message);

      // Save the audio
      if (audioResponse.data?.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioResponse.data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );

        const filename = `${crypto.randomUUID()}.mp3`;
        await supabase.storage
          .from('audio-stories')
          .upload(filename, audioBlob);

        await supabase
          .from('audio_stories')
          .insert({
            story_id: savedStory.id,
            user_id: session.user.id,
            audio_url: filename,
            voice_id: "fable",
            credits_used: 3
          });
      }

      setGeneratedStory(story);
      toast({
        title: "Success!",
        description: "Your magical story is ready!",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    } finally {
      resetStates();
    }
  };

  if (generatedStory) {
    return (
      <StoryCreatorLayout>
        <div className="flex justify-center">
          <Story
            content={generatedStory}
            enrichment={null}
            onReflect={() => {}}
            onCreateNew={() => {
              setGeneratedStory("");
              setAgeGroup("");
              setStoryType("");
              resetStates();
            }}
            ageGroup={ageGroup}
            genre={storyType}
          />
        </div>
      </StoryCreatorLayout>
    );
  }

  return (
    <StoryCreatorLayout>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <StoryCreatorHeader />

        <AgeGroupTabs 
          selectedAgeGroup={ageGroup} 
          onAgeGroupChange={setAgeGroup} 
        />

        <StoryCreatorSteps
          ageGroup={ageGroup}
          storyType={storyType}
          onAgeGroupSelect={setAgeGroup}
          onStoryTypeSelect={setStoryType}
        />
        
        <GenerateStoryButton
          storyType={storyType}
          isGenerating={isGenerating}
          onClick={() => setShowConfirmDialog(true)}
        />

        <StoryGenerationStatus
          isGenerating={isGenerating}
          generationStep={generationStep}
        />

        <StoryGenerationModal
          isOpen={isGenerating}
          generationStep={generationStep}
        />

        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleGenerate}
          totalCredits={9}
        />
      </div>
    </StoryCreatorLayout>
  );
};

export default KidsStoryCreator;
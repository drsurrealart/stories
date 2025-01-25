import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryCreatorLayout } from "@/components/kids/StoryCreatorLayout";
import { StoryTypeSelector } from "@/components/kids/StoryTypeSelector";
import { GenerateStoryButton } from "@/components/kids/GenerateStoryButton";
import { StoryGenerationModal } from "@/components/kids/StoryGenerationModal";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function KidsStoryCreator() {
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateStory = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep("Creating your magical story...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to create stories",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-story', {
        body: { 
          preferences: {
            ageGroup: 'children',
            genre: storyType,
            moral: 'kindness',
            lengthPreference: 'short',
            language: 'english',
            tone: 'playful',
            readingLevel: 'beginner'
          },
          mode: 'kids'
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate story");
      }

      setGenerationStep("Saving your story...");
      
      // Find the newly created story's ID from the response
      const storyId = response.data?.storyId;
      
      // Clear generation state
      setIsGenerating(false);
      setGenerationStep("");
      
      // Redirect to the story page
      if (storyId) {
        navigate(`/your-stories?story=${storyId}`);
      } else {
        navigate('/your-stories'); // Fallback to stories list if ID not available
      }

    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      // Clear generation state on error
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <StoryCreatorLayout>
      <StoryTypeSelector
        selectedType={storyType}
        onSelect={setStoryType}
        disabled={isGenerating}
      />
      
      <GenerateStoryButton
        storyType={storyType}
        isGenerating={isGenerating}
        onClick={generateStory}
      />

      <StoryGenerationModal
        isOpen={isGenerating}
        generationStep={generationStep}
      />
    </StoryCreatorLayout>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryCreatorLayout } from "@/components/kids/StoryCreatorLayout";
import { StoryTypeSelector } from "@/components/kids/StoryTypeSelector";
import { GenerateStoryButton } from "@/components/kids/GenerateStoryButton";
import { StoryGenerationModal } from "@/components/kids/StoryGenerationModal";
import { ConfirmationDialog } from "@/components/kids/ConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function KidsStoryCreator() {
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateClick = () => {
    setShowConfirmDialog(true);
  };

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
      
      // Extract the story content and other data
      const { story, enrichment, imagePrompt } = response.data;
      
      // Save the story to the database
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title: story.split('\n')[0], // First line is the title
          content: story,
          age_group: 'children',
          genre: storyType,
          moral: 'kindness',
          author_id: session.user.id,
          image_prompt: imagePrompt,
          reflection_questions: enrichment?.reflection_questions || [],
          action_steps: enrichment?.action_steps || [],
          related_quote: enrichment?.related_quote || '',
          discussion_prompts: enrichment?.discussion_prompts || []
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Clear generation state
      setIsGenerating(false);
      setGenerationStep("");
      setShowConfirmDialog(false);
      
      // Redirect to the story page
      if (savedStory?.id) {
        navigate(`/your-stories?story=${savedStory.id}`);
      } else {
        navigate('/your-stories');
      }

    } catch (error: any) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      // Clear generation state on error
      setIsGenerating(false);
      setGenerationStep("");
      setShowConfirmDialog(false);
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
        onClick={handleGenerateClick}
      />

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={generateStory}
        totalCredits={9} // 1 for story + 3 for audio + 5 for image
      />

      <StoryGenerationModal
        isOpen={isGenerating}
        generationStep={generationStep}
      />
    </StoryCreatorLayout>
  );
}
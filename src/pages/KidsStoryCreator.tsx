import { useState, useEffect } from "react";
import { StoryCreatorLayout } from "@/components/kids/StoryCreatorLayout";
import { StoryCreatorHeader } from "@/components/kids/StoryCreatorHeader";
import { StoryTypeSelector } from "@/components/kids/StoryTypeSelector";
import { GenerateStoryButton } from "@/components/kids/GenerateStoryButton";
import { StoryGenerationModal } from "@/components/kids/StoryGenerationModal";
import { ConfirmationDialog } from "@/components/kids/ConfirmationDialog";
import { AgeGroupTabs } from "@/components/kids/AgeGroupTabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { StoryActions } from "@/components/story/StoryActions";
import { AudioGenerationForm } from "@/components/story/audio/AudioGenerationForm";
import { AudioPlayer } from "@/components/story/audio/AudioPlayer";
import { Lightbulb } from "lucide-react";

// Helper function to map UI age groups to database age groups
const mapAgeGroupToDbGroup = (uiAgeGroup: string): string => {
  switch (uiAgeGroup) {
    case '5-7':
      return 'preschool';
    case '8-10':
      return 'elementary';
    case '11-12':
      return 'tween';
    default:
      return 'preschool';
  }
};

export default function KidsStoryCreator() {
  const [ageGroup, setAgeGroup] = useState("5-7");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showAudioConfirm, setShowAudioConfirm] = useState(false);
  const { toast } = useToast();

  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value);
    setStoryType(""); // Reset story type when age group changes
  };

  const handleGenerateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleModalClose = () => {
    setIsGenerating(false);
    setGenerationStep("");
    window.location.reload(); // Refresh the page when modal closes
  };

  const handleCreateNew = () => {
    setGeneratedStory(null);
    setStoryType("");
  };

  const generateStory = async () => {
    try {
      setShowConfirmDialog(false);
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

      const dbAgeGroup = mapAgeGroupToDbGroup(ageGroup);

      const response = await supabase.functions.invoke('generate-story', {
        body: { 
          preferences: {
            ageGroup: dbAgeGroup,
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
      
      // Split content to separate moral from the rest of the story
      const parts = story.split("Moral:");
      const storyContent = parts[0].trim();
      const moral = parts[1]?.trim() || "";
      
      // Extract title from the first line
      const titleMatch = storyContent.match(/^(.+?)\n/);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
      const contentWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();
      
      // Generate a unique slug from the title with timestamp
      const timestamp = new Date().getTime();
      const slug = `${title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${timestamp}`;
      
      // Save the story to the database
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title,
          content: contentWithoutTitle,
          moral: moral,
          age_group: dbAgeGroup,
          genre: storyType,
          author_id: session.user.id,
          image_prompt: imagePrompt,
          reflection_questions: enrichment?.reflection_questions || [],
          action_steps: enrichment?.action_steps || [],
          related_quote: enrichment?.related_quote || '',
          discussion_prompts: enrichment?.discussion_prompts || [],
          slug
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Set the generated story in state
      setGeneratedStory(savedStory);
      
      // Clear generation state and close modals
      setIsGenerating(false);
      setGenerationStep("");
      setShowConfirmDialog(false);

      toast({
        title: "Story created!",
        description: "Your magical story has been created successfully.",
      });

    } catch (error: any) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      // Clear generation state and close modals on error
      setIsGenerating(false);
      setGenerationStep("");
      setShowConfirmDialog(false);
    }
  };

  const handleGenerateAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      setShowAudioConfirm(false);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('text-to-speech', {
        body: { 
          storyId: generatedStory.id,
          voiceId: selectedVoice,
          userId: session.user.id
        }
      });

      if (response.error) throw response.error;

      // Refresh the story data to get the new audio URL
      const { data: updatedStory, error: refreshError } = await supabase
        .from('stories')
        .select(`
          *,
          audio_stories (*)
        `)
        .eq('id', generatedStory.id)
        .single();

      if (refreshError) throw refreshError;
      setGeneratedStory(updatedStory);

      toast({
        title: "Success",
        description: "Audio version created successfully!",
      });

    } catch (error: any) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <StoryCreatorLayout>
      {!generatedStory ? (
        <div className="space-y-8">
          <StoryCreatorHeader />
          
          <AgeGroupTabs
            selectedAgeGroup={ageGroup}
            onAgeGroupChange={handleAgeGroupChange}
          />
          
          <StoryTypeSelector
            selectedType={storyType}
            onSelect={setStoryType}
            ageGroup={ageGroup}
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
            totalCredits={9}
          />

          <StoryGenerationModal
            isOpen={isGenerating}
            generationStep={generationStep}
            onOpenChange={handleModalClose}
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="p-6">
            <h1 className="text-3xl font-bold mb-6">{generatedStory.title}</h1>
            <div className="prose max-w-none space-y-4">
              <div className="text-story-text whitespace-pre-line">
                {generatedStory.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {generatedStory.moral && (
                <Card className="bg-primary/10 p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Moral of the Story</h3>
                  </div>
                  <p className="text-story-text whitespace-pre-line">{generatedStory.moral}</p>
                </Card>
              )}
            </div>
          </Card>

          {generatedStory.audio_stories?.[0]?.audio_url ? (
            <Card className="p-6">
              <AudioPlayer 
                audioUrl={generatedStory.audio_stories[0].audio_url}
                isKidsMode={true}
              />
            </Card>
          ) : (
            <Card className="p-6">
              <AudioGenerationForm
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                isGenerating={isGeneratingAudio}
                showConfirmDialog={showAudioConfirm}
                onConfirmDialogChange={setShowAudioConfirm}
                onGenerate={handleGenerateAudio}
                isKidsMode={true}
              />
            </Card>
          )}

          <StoryActions
            onReflect={() => {}}
            onCreateNew={handleCreateNew}
            isKidsMode={true}
          />
        </div>
      )}
    </StoryCreatorLayout>
  );
}
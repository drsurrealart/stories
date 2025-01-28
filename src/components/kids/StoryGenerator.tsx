import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoryTypeSelector } from "./StoryTypeSelector";
import { GenerateStoryButton } from "./GenerateStoryButton";
import { AgeGroupTabs } from "./AgeGroupTabs";

interface StoryGeneratorProps {
  onStoryGenerated: (story: any) => void;
}

export function StoryGenerator({ onStoryGenerated }: StoryGeneratorProps) {
  const [ageGroup, setAgeGroup] = useState("5-7");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
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
        setIsGenerating(false);
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

      const { story, enrichment, imagePrompt } = response.data;
      
      const parts = story.split("Moral:");
      const storyContent = parts[0].trim();
      const moral = parts[1]?.trim() || "";
      
      const titleMatch = storyContent.match(/^(.+?)\n/);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
      const contentWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();
      
      const timestamp = new Date().getTime();
      const slug = `${title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${timestamp}`;
      
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

      onStoryGenerated(savedStory);
      
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
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <div className="space-y-8">
      <AgeGroupTabs
        selectedAgeGroup={ageGroup}
        onAgeGroupChange={setAgeGroup}
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
        onClick={generateStory}
        generationStep={generationStep}
      />
    </div>
  );
}

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
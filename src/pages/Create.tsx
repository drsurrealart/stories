import { StoryForm } from "@/components/StoryForm";
import { NavigationBar } from "@/components/NavigationBar";
import { useState } from "react";
import { Story } from "@/components/Story";
import { ReflectionQuestions } from "@/components/ReflectionQuestions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StoryPreferences } from "@/components/StoryForm";

type AppState = "form" | "story" | "reflection";

const Create = () => {
  const [appState, setAppState] = useState<AppState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState("");
  const [enrichment, setEnrichment] = useState<{
    reflection_questions: string[];
    action_steps: string[];
    related_quote: string;
    discussion_prompts: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const generateStory = async (preferences: StoryPreferences) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No authentication token found");
      }

      const response = await supabase.functions.invoke('generate-story', {
        body: { preferences }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate story");
      }

      // Save the story to the database
      const storyContent = response.data.story;
      const enrichmentData = response.data.enrichment;
      const parts = storyContent.split("\n");
      const title = parts[0].trim();
      const remainingContent = parts.slice(1).join("\n").trim();

      // Generate a slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Extract moral if present
      const moralParts = remainingContent.split("Moral:");
      const content = moralParts[0].trim();
      const moral = moralParts[1]?.trim() || "";

      const { error: saveError } = await supabase
        .from('stories')
        .insert({
          title,
          content,
          moral,
          author_id: session.user.id,
          age_group: preferences.ageGroup,
          genre: preferences.genre,
          slug,
          reflection_questions: enrichmentData.reflection_questions,
          action_steps: enrichmentData.action_steps,
          related_quote: enrichmentData.related_quote,
          discussion_prompts: enrichmentData.discussion_prompts
        });

      if (saveError) {
        throw saveError;
      }

      setStory(storyContent);
      setEnrichment(enrichmentData);
      setAppState("story");
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setAppState("form");
    setStory("");
    setEnrichment(null);
  };

  const reflectionQuestions = [
    "What was the main lesson of this story?",
    "How did the characters demonstrate the moral value?",
    "How can you apply this lesson in your own life?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-center">
          {appState === "form" && (
            <StoryForm onSubmit={generateStory} isLoading={isLoading} />
          )}
          
          {appState === "story" && story && (
            <Story
              content={story}
              enrichment={enrichment}
              onReflect={() => setAppState("reflection")}
              onCreateNew={handleCreateNew}
            />
          )}
          
          {appState === "reflection" && (
            <ReflectionQuestions
              questions={reflectionQuestions}
              onComplete={() => setAppState("form")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
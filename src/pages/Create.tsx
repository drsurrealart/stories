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

      setStory(response.data.story);
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
              onReflect={() => setAppState("reflection")}
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
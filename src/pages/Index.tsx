import { useState } from "react";
import { StoryForm, type StoryPreferences } from "@/components/StoryForm";
import { Story } from "@/components/Story";
import { ReflectionQuestions } from "@/components/ReflectionQuestions";
import { useToast } from "@/hooks/use-toast";
import { initializeSettings } from "@/utils/settings";
import { supabase } from "@/integrations/supabase/client";

type AppState = "form" | "story" | "reflection";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState("");
  const { toast } = useToast();

  useState(() => {
    initializeSettings();
  });

  const generateStory = async (preferences: StoryPreferences) => {
    setIsLoading(true);
    try {
      console.log("Generating story with preferences:", preferences);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No authentication token found");
      }

      const response = await supabase.functions.invoke('generate-story', {
        body: { preferences }
      });

      if (response.error) {
        console.error("Story generation error:", response.error);
        throw new Error(response.error.message || "Failed to generate story");
      }

      console.log("Received story:", response.data);
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

export default Index;
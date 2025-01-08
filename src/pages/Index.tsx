import { useState } from "react";
import { StoryForm, type StoryPreferences } from "@/components/StoryForm";
import { Story } from "@/components/Story";
import { ReflectionQuestions } from "@/components/ReflectionQuestions";
import { useToast } from "@/components/ui/use-toast";
import { initializeSettings } from "@/utils/settings";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";

type AppState = "form" | "story" | "reflection";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState("");
  const { toast } = useToast();

  useState(() => {
    initializeSettings();
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const generateStory = async (preferences: StoryPreferences) => {
    setIsLoading(true);
    try {
      const prompt = `Create a ${preferences.genre} story for ${preferences.ageGroup} age group about ${preferences.moral}. The story should be engaging and end with a clear moral lesson. Keep it concise but meaningful.`;
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a skilled storyteller who creates engaging, age-appropriate stories with clear moral lessons.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();
      setStory(data.choices[0].message.content);
      setAppState("story");
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
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

export default Index;

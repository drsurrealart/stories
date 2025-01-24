import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryForm } from "@/components/StoryForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

type StoryPreferences = {
  ageGroup: string;
  genre: string;
  moral: string;
  readingLevel: "early_reader" | "beginner" | "intermediate" | "advanced" | "fluent";
  lengthPreference: string;
  language: string;
  tone: string;
};

export default function ParentsStoryCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (preferences: StoryPreferences) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a story",
          variant: "destructive",
        });
        return;
      }

      const slug = nanoid();

      const { data: story, error } = await supabase
        .from("stories")
        .insert({
          title: `Parent Story - ${new Date().toLocaleDateString()}`,
          content: "Story content will be generated...",
          age_group: preferences.ageGroup,
          genre: preferences.genre,
          moral: preferences.moral,
          author_id: user.id,
          slug,
          language: preferences.language,
          tone: preferences.tone,
          poetic_style: "prose",
          reading_level: preferences.readingLevel,
          length_preference: preferences.lengthPreference
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (story) {
        navigate(`/story/${story.slug}`);
      }
    } catch (error) {
      console.error("Error creating story:", error);
      toast({
        title: "Error",
        description: "Failed to create story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a Story for Your Family</h1>
      <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
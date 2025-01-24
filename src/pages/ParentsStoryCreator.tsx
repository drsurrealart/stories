import { StoryForm, StoryPreferences } from "@/components/StoryForm";
import { NavigationBar } from "@/components/NavigationBar";
import { useState } from "react";
import { Story } from "@/components/Story";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ParentsStoryCreator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (preferences: StoryPreferences) => {
    try {
      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to create stories",
          variant: "destructive",
        });
        return;
      }

      // Generate story
      const storyResponse = await supabase.functions.invoke('generate-story', {
        body: { preferences }
      });

      if (storyResponse.error) throw new Error(storyResponse.error.message);
      const story = storyResponse.data.story;
      const imagePrompt = storyResponse.data.imagePrompt;

      // Create URL-friendly slug
      const title = story.split('\n')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Save the story
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title,
          content: story,
          age_group: preferences.ageGroup,
          genre: preferences.genre,
          moral: preferences.moral,
          author_id: session.user.id,
          image_prompt: imagePrompt,
          slug,
          length_preference: preferences.lengthPreference,
          language: preferences.language,
          tone: preferences.tone,
          poetic_style: "prose",
          reading_level: preferences.readingLevel as "early_reader" | "beginner" | "intermediate" | "advanced" | "fluent"
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setGeneratedStory(story);
      toast({
        title: "Success!",
        description: "Your story has been created!",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
        <NavigationBar onLogout={() => {}} />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Story
            content={generatedStory}
            enrichment={null}
            onReflect={() => {}}
            onCreateNew={() => {
              setGeneratedStory("");
            }}
            ageGroup="all"
            genre="any"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-8">Create a Family Story</h1>
        <StoryForm onSubmit={handleSubmit} isLoading={isGenerating} />
      </div>
    </div>
  );
};

export default ParentsStoryCreator;
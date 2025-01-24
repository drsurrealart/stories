import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { StoryForm } from "@/components/StoryForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const ParentsStoryCreator = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a story",
          variant: "destructive",
        });
        return;
      }

      const storyData = {
        content: formData.content,
        age_group: formData.ageGroup,
        genre: formData.genre,
        moral: formData.moral,
        author_id: user.id,
        slug: formData.content.substring(0, 50).toLowerCase().replace(/\s+/g, '-'),
        reading_level: "intermediate" as const,
        poetic_style: "prose" as const,
        language: formData.language || "english",
        tone: formData.tone || "standard",
        length_preference: formData.lengthPreference || "medium",
        reflection_questions: formData.reflectionQuestions || [],
        action_steps: formData.actionSteps || [],
        discussion_prompts: formData.discussionPrompts || [],
        image_prompt: formData.imagePrompt,
      };

      const { error } = await supabase
        .from('stories')
        .insert([storyData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story created successfully!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating story:', error);
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
    <div className="min-h-screen bg-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-primary mb-8">Create a Family Story</h1>
        <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ParentsStoryCreator;
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoryContent } from "./story/StoryContent";
import { StoryFeedback } from "./story/StoryFeedback";
import { StoryActions } from "./story/StoryActions";

interface StoryProps {
  content: string;
  onReflect: () => void;
}

export function Story({ content, onReflect }: StoryProps) {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Split content to separate moral from the rest of the story
  const parts = content.split("Moral:");
  const storyContent = parts[0].trim();
  const moral = parts[1]?.trim() || "";

  // Extract title from the first line of the story
  const titleMatch = storyContent.match(/^(.+?)\n/);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
  const storyWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();

  const handleSaveStory = async () => {
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to save stories",
          variant: "destructive",
        });
        return;
      }

      // First, check if the story already exists to prevent duplicates
      const { data: existingStories } = await supabase
        .from('stories')
        .select('id')
        .eq('title', title)
        .eq('author_id', session.user.id)
        .single();

      if (existingStories) {
        toast({
          title: "Story already saved",
          description: "This story is already in your collection",
        });
        return;
      }

      const { error } = await supabase
        .from('stories')
        .insert({
          title,
          content: storyContent,
          moral,
          author_id: session.user.id,
          age_group: "preschool", // Using a valid age group value
          genre: "fantasy", // Using a valid genre value
        });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Story saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save the story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in bg-story-background">
      <StoryContent
        title={title}
        content={storyWithoutTitle}
        moral={moral}
      />

      <div className="border-t pt-4 md:pt-6 space-y-3 md:space-y-4">
        <StoryFeedback
          feedback={feedback}
          onFeedback={setFeedback}
        />
        <StoryActions
          onSave={handleSaveStory}
          onReflect={onReflect}
          isSaving={isSaving}
        />
      </div>
    </Card>
  );
}
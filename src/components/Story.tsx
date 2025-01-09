import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoryContent } from "./story/StoryContent";
import { StoryFeedback } from "./story/StoryFeedback";
import { StoryActions } from "./story/StoryActions";
import { StorySocialShare } from "./story/StorySocialShare";
import { useQuery } from "@tanstack/react-query";

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

  // Generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Fetch saved stories count and limit
  const { data: saveLimits } = useQuery({
    queryKey: ['user-save-limits'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Get user's subscription level
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_level')
        .eq('id', session.user.id)
        .single();

      // Get subscription tier limits
      const { data: tierLimits } = await supabase
        .from('subscription_tiers')
        .select('saved_stories_limit')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      // Get current saved stories count
      const { count: savedCount } = await supabase
        .from('stories')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', session.user.id);

      return {
        savedCount: savedCount || 0,
        saveLimit: tierLimits?.saved_stories_limit || 0,
        subscriptionLevel: profile?.subscription_level || 'free'
      };
    }
  });

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

      if (saveLimits && saveLimits.savedCount >= saveLimits.saveLimit) {
        toast({
          title: "Saved stories limit reached",
          description: `You've reached your ${saveLimits.saveLimit} saved stories limit. Upgrade your subscription to save more stories!`,
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

      const slug = generateSlug(title);

      const { error } = await supabase
        .from('stories')
        .insert({
          title,
          content: storyContent,
          moral,
          author_id: session.user.id,
          age_group: "preschool",
          genre: "fantasy",
          slug
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
        {saveLimits && (
          <div className="text-sm text-muted-foreground">
            Saved stories: {saveLimits.savedCount} / {saveLimits.saveLimit}
          </div>
        )}
        <StoryFeedback
          feedback={feedback}
          onFeedback={setFeedback}
        />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <StoryActions
            onSave={handleSaveStory}
            onReflect={onReflect}
            isSaving={isSaving}
          />
          <StorySocialShare
            title={title}
            content={storyWithoutTitle}
            moral={moral}
            url={window.location.href}
          />
        </div>
      </div>
    </Card>
  );
}
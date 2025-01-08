import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle, BookmarkPlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      const { error } = await supabase.from('stories').insert({
        title,
        content: storyContent,
        moral,
        author_id: session.user.id,
        age_group: "all", // You might want to pass this as a prop from the parent
        genre: "general", // You might want to pass this as a prop from the parent
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story saved successfully",
      });
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Error",
        description: "Failed to save the story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in bg-story-background">
      <div className="prose max-w-none">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-story-text leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {storyWithoutTitle}
        </div>
      </div>

      {moral && (
        <Card className="bg-secondary p-4 md:p-6 mt-4">
          <h3 className="font-semibold text-lg mb-2">Moral</h3>
          <p className="text-story-text">{moral}</p>
        </Card>
      )}

      <div className="border-t pt-4 md:pt-6 space-y-3 md:space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="text-sm text-gray-500">How was this story?</div>
          <div className="flex space-x-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback("liked")}
              className={`flex-1 md:flex-none ${feedback === "liked" ? "bg-primary text-white" : ""}`}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback("disliked")}
              className={`flex-1 md:flex-none ${feedback === "disliked" ? "bg-destructive text-white" : ""}`}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Dislike
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button onClick={handleSaveStory} className="flex-1 md:flex-none" disabled={isSaving}>
            <BookmarkPlus className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Story"}
          </Button>
          <Button onClick={onReflect} className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Reflect on the Story
          </Button>
        </div>
      </div>
    </Card>
  );
}
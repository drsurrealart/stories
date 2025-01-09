import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StoryContent } from "@/components/story/StoryContent";

export default function SharedStory() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: story, isLoading } = useQuery({
    queryKey: ['shared-story', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          Loading story...
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
          <p className="mb-4">The story you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/auth')}>Join LearnMorals.com</Button>
        </div>
      </div>
    );
  }

  // Split content to separate moral from the rest of the story
  const parts = story.content.split("Moral:");
  const storyContent = parts[0].trim();
  const moral = parts[1]?.trim() || "";

  // Extract title from the first line of the story
  const titleMatch = storyContent.match(/^(.+?)\n/);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
  const contentWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 md:p-8 space-y-6">
          <StoryContent
            title={title}
            content={contentWithoutTitle}
            moral={moral}
          />
        </Card>

        <Card className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Discover More Stories on LearnMorals.com</h2>
          <p className="text-muted-foreground">
            Join our community to access hundreds of moral stories and create your own personalized stories.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto"
          >
            Sign Up Free
          </Button>
        </Card>
      </div>
    </div>
  );
}
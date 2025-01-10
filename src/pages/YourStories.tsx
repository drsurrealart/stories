import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Lightbulb, BookOpen, Clock, GraduationCap } from "lucide-react";
import { StorySocialShare } from "@/components/story/StorySocialShare";
import { StoryEnrichment } from "@/components/story/StoryEnrichment";
import { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

interface SavedStory {
  id: string;
  title: string;
  content: string;
  moral: string;
  created_at: string;
  reflection_questions: Json;
  action_steps: Json;
  related_quote: string | null;
  discussion_prompts: Json;
  age_group: string;
  genre: string;
  language: string;
  tone: string;
  reading_level: string;
  length_preference: string;
}

const YourStories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast({
        title: "Error",
        description: "Failed to load your stories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      setStories(stories.filter(story => story.id !== storyId));
      toast({
        title: "Success",
        description: "Story deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete the story",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Stories</h1>
        
        {isLoading ? (
          <div className="text-center">Loading your stories...</div>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven't saved any stories yet.
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <Card key={story.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Saved on {formatDate(story.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="prose max-w-none">
                  <div className="text-story-text whitespace-pre-wrap">
                    {story.content}
                  </div>
                </div>
                {story.moral && (
                  <Card className="bg-secondary p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Moral</h3>
                    </div>
                    <p className="text-story-text">{story.moral}</p>
                  </Card>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {story.age_group && (
                    <Badge variant="secondary" className="capitalize">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {story.age_group}
                    </Badge>
                  )}
                  {story.genre && (
                    <Badge variant="secondary" className="capitalize">
                      {story.genre}
                    </Badge>
                  )}
                  {story.reading_level && story.reading_level !== "intermediate" && (
                    <Badge variant="secondary" className="capitalize">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {story.reading_level} level
                    </Badge>
                  )}
                  {story.length_preference && story.length_preference !== "medium" && (
                    <Badge variant="secondary" className="capitalize">
                      <Clock className="h-3 w-3 mr-1" />
                      {story.length_preference} length
                    </Badge>
                  )}
                  {story.language && story.language !== "english" && (
                    <Badge variant="secondary" className="capitalize">
                      {story.language}
                    </Badge>
                  )}
                  {story.tone && story.tone !== "standard" && (
                    <Badge variant="secondary" className="capitalize">
                      {story.tone}
                    </Badge>
                  )}
                </div>

                {story.reflection_questions && (
                  <StoryEnrichment
                    reflectionQuestions={story.reflection_questions as string[]}
                    actionSteps={story.action_steps as string[]}
                    relatedQuote={story.related_quote || ''}
                    discussionPrompts={story.discussion_prompts as string[]}
                  />
                )}
                <div className="pt-4 border-t">
                  <StorySocialShare
                    title={story.title}
                    content={story.content}
                    moral={story.moral}
                    url={window.location.href}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourStories;
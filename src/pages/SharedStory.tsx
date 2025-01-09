import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SharedStory = () => {
  const { slug } = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Story not found');
        
        setStory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || 'Story not found'}
        </h1>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center">{story.title}</h1>
          
          <div className="prose max-w-none">
            <div className="text-story-text whitespace-pre-wrap">
              {story.content}
            </div>
          </div>
          
          {story.moral && (
            <Card className="bg-secondary p-4">
              <h3 className="font-semibold mb-2">Moral</h3>
              <p className="text-story-text">{story.moral}</p>
            </Card>
          )}

          <div className="border-t pt-6 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                Discover More Stories on LearnMorals.com
              </h2>
              <p className="text-muted-foreground">
                Join our community to access hundreds of educational stories and create your own!
              </p>
              <Link to="/auth">
                <Button size="lg" className="mt-4">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharedStory;
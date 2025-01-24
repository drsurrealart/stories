import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby, Wand2, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const CreateKidsStory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [theme, setTheme] = useState("");
  const { toast } = useToast();

  const { data: userLimits } = useQuery({
    queryKey: ['user-story-limits'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_level')
        .eq('id', session.user.id)
        .single();

      const { data: tierLimits } = await supabase
        .from('subscription_tiers')
        .select('monthly_credits')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: creditCount } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .single();

      return {
        creditsUsed: creditCount?.credits_used || 0,
        monthlyCredits: tierLimits?.monthly_credits || 0,
      };
    }
  });

  const handleCreateStory = async () => {
    if (!ageGroup || !theme) {
      toast({
        title: "Oops!",
        description: "Please choose both options to create your story!",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create stories",
        variant: "destructive",
      });
      return;
    }

    if (userLimits && userLimits.creditsUsed >= userLimits.monthlyCredits) {
      toast({
        title: "No more credits left",
        description: "Ask a grown-up to get more credits!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('generate-story', {
        body: {
          preferences: {
            ageGroup,
            genre: theme,
            moral: "being_kind",
            lengthPreference: "short",
            language: "english",
            tone: "funny",
            readingLevel: "early_reader"
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Yay! Your story is ready!",
        description: "Time to read and listen to your story!",
      });

    } catch (error) {
      console.error("Error creating story:", error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Let's try again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-12">
      <Card className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <Baby className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create Your Kids Story!</h1>
          <p className="text-gray-600">Let's make something amazing together!</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-medium">How old are you?</label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="text-lg p-6">
                <SelectValue placeholder="Pick your age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preschool">3-5 years old</SelectItem>
                <SelectItem value="elementary">6-8 years old</SelectItem>
                <SelectItem value="tween">9-12 years old</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium">What kind of story do you want?</label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="text-lg p-6">
                <SelectValue placeholder="Choose your story type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="animals">Animal Adventure</SelectItem>
                <SelectItem value="fairytale">Magical Fairy Tale</SelectItem>
                <SelectItem value="superhero">Superhero Story</SelectItem>
                <SelectItem value="space">Space Journey</SelectItem>
                <SelectItem value="dinosaurs">Dinosaur Tale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full text-lg py-6"
            size="lg"
            onClick={handleCreateStory}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating your story...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                <span>Create My Story!</span>
              </div>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateKidsStory;
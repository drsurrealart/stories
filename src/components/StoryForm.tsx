import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AgeGroupSelect } from "./story/AgeGroupSelect";
import { GenreSelect } from "./story/GenreSelect";
import { MoralSelect } from "./story/MoralSelect";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface StoryPreferences {
  genre: string;
  ageGroup: string;
  moral: string;
}

interface StoryFormProps {
  onSubmit: (preferences: StoryPreferences) => void;
  isLoading: boolean;
}

export function StoryForm({ onSubmit, isLoading }: StoryFormProps) {
  const [preferences, setPreferences] = useState<StoryPreferences>({
    genre: "",
    ageGroup: "",
    moral: "",
  });
  const { toast } = useToast();

  // Fetch user's story count and subscription tier
  const { data: userLimits } = useQuery({
    queryKey: ['user-story-limits'],
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
        .select('stories_per_month')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      // Get current month's story count
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: storyCount } = await supabase
        .from('user_story_counts')
        .select('stories_generated')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .single();

      return {
        storiesGenerated: storyCount?.stories_generated || 0,
        monthlyLimit: tierLimits?.stories_per_month || 0,
        subscriptionLevel: profile?.subscription_level || 'free'
      };
    }
  });

  const handleAgeGroupChange = (value: string) => {
    setPreferences({
      ageGroup: value,
      genre: "",
      moral: "",
    });
  };

  const handleSubmit = async () => {
    if (!preferences.genre || !preferences.ageGroup || !preferences.moral) {
      toast({
        title: "Please fill in all fields",
        description: "We need these details to create your perfect story!",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate stories",
        variant: "destructive",
      });
      return;
    }

    if (userLimits && userLimits.storiesGenerated >= userLimits.monthlyLimit) {
      toast({
        title: "Monthly limit reached",
        description: `You've reached your ${userLimits.monthlyLimit} stories limit for this month. Upgrade your subscription to generate more stories!`,
        variant: "destructive",
      });
      return;
    }

    onSubmit(preferences);
  };

  return (
    <Card className="w-full max-w-md p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in mx-4 md:mx-0">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">Create Your Story</h2>
      </div>

      {userLimits && (
        <div className="text-sm text-muted-foreground">
          Stories this month: {userLimits.storiesGenerated} / {userLimits.monthlyLimit}
        </div>
      )}

      <div className="space-y-4">
        <AgeGroupSelect
          value={preferences.ageGroup}
          onChange={handleAgeGroupChange}
        />

        {preferences.ageGroup && (
          <GenreSelect
            value={preferences.genre}
            onChange={(value) => setPreferences({ ...preferences, genre: value })}
            ageGroup={preferences.ageGroup}
          />
        )}

        {preferences.ageGroup && (
          <MoralSelect
            value={preferences.moral}
            onChange={(value) => setPreferences({ ...preferences, moral: value })}
            ageGroup={preferences.ageGroup}
          />
        )}
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          "Creating your story..."
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Create Story
          </>
        )}
      </Button>
    </Card>
  );
}
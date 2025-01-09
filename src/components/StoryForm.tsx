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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";

export interface StoryPreferences {
  genre: string;
  ageGroup: string;
  moral: string;
  characterName1?: string;
  characterName2?: string;
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
    characterName1: "",
    characterName2: "",
  });
  const { toast } = useToast();

  // Fetch user's credit count and subscription tier
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
        .select('monthly_credits')
        .eq('level', profile?.subscription_level || 'free')
        .single();

      // Get current month's credit usage
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
        subscriptionLevel: profile?.subscription_level || 'free'
      };
    }
  });

  const handleAgeGroupChange = (value: string) => {
    setPreferences({
      ...preferences,
      ageGroup: value,
      genre: "",
      moral: "",
    });
  };

  const validateName = (name: string) => {
    if (name && name.length > 20) {
      toast({
        title: "Name too long",
        description: "Character names must be 20 characters or less",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNameChange = (field: 'characterName1' | 'characterName2', value: string) => {
    if (!value || validateName(value)) {
      setPreferences({ ...preferences, [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!preferences.genre || !preferences.ageGroup || !preferences.moral) {
      toast({
        title: "Please fill in all required fields",
        description: "We need these details to create your perfect story!",
        variant: "destructive",
      });
      return;
    }

    if (
      (preferences.characterName1 && !validateName(preferences.characterName1)) ||
      (preferences.characterName2 && !validateName(preferences.characterName2))
    ) {
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

    if (userLimits && userLimits.creditsUsed >= userLimits.monthlyCredits) {
      toast({
        title: "Monthly credit limit reached",
        description: `You've used all your ${userLimits.monthlyCredits} AI credits for this month. Upgrade your subscription to get more credits!`,
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
          AI Credits remaining: {userLimits.monthlyCredits - userLimits.creditsUsed} / {userLimits.monthlyCredits}
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="characterName1">Character Name 1 (Optional)</Label>
            <Input
              id="characterName1"
              placeholder="Enter a character name"
              value={preferences.characterName1}
              onChange={(e) => handleNameChange('characterName1', e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterName2">Character Name 2 (Optional)</Label>
            <Input
              id="characterName2"
              placeholder="Enter another character name"
              value={preferences.characterName2}
              onChange={(e) => handleNameChange('characterName2', e.target.value)}
              maxLength={20}
            />
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loading size="sm" text="Creating your story..." className="py-1" />
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Create Story (Uses 1 Credit)
          </>
        )}
      </Button>
    </Card>
  );
}

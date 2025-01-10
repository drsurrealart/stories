import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Settings2, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AgeGroupSelect } from "./story/AgeGroupSelect";
import { GenreSelect } from "./story/GenreSelect";
import { MoralSelect } from "./story/MoralSelect";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loading";
import { CharacterNameInput } from "./story/CharacterNameInput";
import { LengthPreferenceSelect } from "./story/LengthPreferenceSelect";
import { LanguageSelect } from "./story/LanguageSelect";
import { ToneSelect } from "./story/ToneSelect";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface StoryPreferences {
  genre: string;
  ageGroup: string;
  moral: string;
  characterName1?: string;
  characterName2?: string;
  lengthPreference: string;
  language: string;
  tone: string;
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
    lengthPreference: "medium",
    language: "english",
    tone: "standard",
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    if (!preferences.genre || !preferences.ageGroup || !preferences.moral) {
      toast({
        title: "Please fill in all required fields",
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
          <CharacterNameInput
            id="characterName1"
            label="Character Name 1 (Optional)"
            value={preferences.characterName1 || ""}
            onChange={(value) => setPreferences({ ...preferences, characterName1: value })}
          />

          <CharacterNameInput
            id="characterName2"
            label="Character Name 2 (Optional)"
            value={preferences.characterName2 || ""}
            onChange={(value) => setPreferences({ ...preferences, characterName2: value })}
          />
        </div>

        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center w-full justify-between"
            >
              <span className="flex items-center">
                <Settings2 className="w-4 h-4 mr-2" />
                Advanced Settings
              </span>
              <span className="text-xs text-muted-foreground">
                {isAdvancedOpen ? "Hide" : "Show"}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <LengthPreferenceSelect
              value={preferences.lengthPreference}
              onChange={(value) => setPreferences({ ...preferences, lengthPreference: value })}
            />
            <LanguageSelect
              value={preferences.language}
              onChange={(value) => setPreferences({ ...preferences, language: value })}
            />
            <ToneSelect
              value={preferences.tone}
              onChange={(value) => setPreferences({ ...preferences, tone: value })}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">Creating...</span>
            <Loading size="sm" className="py-1" />
          </div>
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Settings2, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BasicSettings } from "./story/form/BasicSettings";
import { AdvancedSettings } from "./story/form/AdvancedSettings";
import { CreditInfo } from "./story/form/CreditInfo";

const DEFAULT_PREFERENCES = {
  lengthPreference: "medium",
  language: "english",
  tone: "standard",
  readingLevel: "intermediate",
  characterName1: "",
  characterName2: "",
};

export interface StoryPreferences {
  genre: string;
  ageGroup: string;
  moral: string;
  characterName1?: string;
  characterName2?: string;
  lengthPreference: string;
  language: string;
  tone: string;
  readingLevel: string;
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
    ...DEFAULT_PREFERENCES,
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
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
        subscriptionLevel: profile?.subscription_level || 'free'
      };
    }
  });

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

    // Only include modified advanced settings
    const optimizedPreferences = {
      genre: preferences.genre,
      ageGroup: preferences.ageGroup,
      moral: preferences.moral,
      ...(preferences.characterName1 && { characterName1: preferences.characterName1 }),
      ...(preferences.characterName2 && { characterName2: preferences.characterName2 }),
      ...(preferences.lengthPreference !== DEFAULT_PREFERENCES.lengthPreference && { lengthPreference: preferences.lengthPreference }),
      ...(preferences.language !== DEFAULT_PREFERENCES.language && { language: preferences.language }),
      ...(preferences.tone !== DEFAULT_PREFERENCES.tone && { tone: preferences.tone }),
      ...(preferences.readingLevel !== DEFAULT_PREFERENCES.readingLevel && { readingLevel: preferences.readingLevel }),
    };

    onSubmit(optimizedPreferences as StoryPreferences);
  };

  return (
    <Card className="w-full max-w-md p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in mx-4 md:mx-0">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">Create Your Story</h2>
      </div>

      <CreditInfo userLimits={userLimits} />

      <BasicSettings
        ageGroup={preferences.ageGroup}
        genre={preferences.genre}
        moral={preferences.moral}
        onAgeGroupChange={(value) => {
          setPreferences({
            ...preferences,
            ageGroup: value,
            genre: "",
            moral: "",
          });
        }}
        onGenreChange={(value) => setPreferences({ ...preferences, genre: value })}
        onMoralChange={(value) => setPreferences({ ...preferences, moral: value })}
      />

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
          <AdvancedSettings
            characterName1={preferences.characterName1 || ""}
            characterName2={preferences.characterName2 || ""}
            lengthPreference={preferences.lengthPreference}
            language={preferences.language}
            tone={preferences.tone}
            readingLevel={preferences.readingLevel}
            onCharacterName1Change={(value) => setPreferences({ ...preferences, characterName1: value })}
            onCharacterName2Change={(value) => setPreferences({ ...preferences, characterName2: value })}
            onLengthPreferenceChange={(value) => setPreferences({ ...preferences, lengthPreference: value })}
            onLanguageChange={(value) => setPreferences({ ...preferences, language: value })}
            onToneChange={(value) => setPreferences({ ...preferences, tone: value })}
            onReadingLevelChange={(value) => setPreferences({ ...preferences, readingLevel: value })}
          />
        </CollapsibleContent>
      </Collapsible>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating... please wait</span>
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
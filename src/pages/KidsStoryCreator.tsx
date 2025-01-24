import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Story } from "@/components/Story";

const STORY_TYPES = [
  { id: 'adventure', label: 'Adventure Story', icon: '🗺️', description: 'Go on an exciting journey!' },
  { id: 'magic', label: 'Magic Story', icon: '✨', description: 'Discover magical powers!' },
  { id: 'animals', label: 'Animal Story', icon: '🐾', description: 'Meet friendly animals!' },
  { id: 'space', label: 'Space Story', icon: '🚀', description: 'Explore the universe!' },
];

const AGE_GROUPS = [
  { id: '5-7', label: '5-7 Years', icon: '🌟' },
  { id: '8-10', label: '8-10 Years', icon: '🌈' },
  { id: '11-12', label: '11-12 Years', icon: '⭐' },
];

const KidsStoryCreator = () => {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
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
          title: "Monthly credit limit reached",
          description: `You've used all your ${userLimits.monthlyCredits} credits for this month.`,
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-story', {
        body: {
          preferences: {
            ageGroup,
            genre: storyType,
            moral: "being kind and helpful",
            lengthPreference: "short",
            language: "english",
            tone: "funny",
            readingLevel: "early_reader"
          }
        }
      });

      if (response.error) throw new Error(response.error.message);
      setGeneratedStory(response.data.story);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
        <Story
          content={generatedStory}
          enrichment={null}
          onReflect={() => {}}
          onCreateNew={() => {
            setGeneratedStory("");
            setStep(1);
            setAgeGroup("");
            setStoryType("");
          }}
          ageGroup={ageGroup}
          genre={storyType}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            <BookOpen className="inline-block mr-2 mb-1" />
            Kids Story Creator
          </h1>
          <p className="text-xl text-muted-foreground">
            {step === 1 ? "How old are you?" : "What kind of story do you want?"}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {AGE_GROUPS.map((group) => (
              <Card
                key={group.id}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  ageGroup === group.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setAgeGroup(group.id);
                  setStep(2);
                }}
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl">{group.icon}</div>
                  <h3 className="text-xl font-bold">{group.label}</h3>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {STORY_TYPES.map((type) => (
              <Card
                key={type.id}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  storyType === type.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setStoryType(type.id)}
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl">{type.icon}</div>
                  <h3 className="text-xl font-bold">{type.label}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleGenerate}
              disabled={!storyType || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your story...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Create My Story!
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsStoryCreator;
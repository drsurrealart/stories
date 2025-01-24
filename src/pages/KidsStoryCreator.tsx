import { useState } from "react";
import { BookOpen, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Story } from "@/components/Story";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { AgeGroupSelector } from "@/components/kids/AgeGroupSelector";
import { StoryTypeSelector } from "@/components/kids/StoryTypeSelector";
import { ConfirmationDialog } from "@/components/kids/ConfirmationDialog";
import { KIDS_AGE_GROUPS, KIDS_STORY_TYPES } from "@/data/storyOptions";

const KidsStoryCreator = () => {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  // Fetch credit costs - now specifically for AUDIO_STORY_CREDITS configuration
  const { data: creditCosts } = useQuery({
    queryKey: ['credit-costs'],
    queryFn: async () => {
      const { data: config, error } = await supabase
        .from('api_configurations')
        .select('audio_credits_cost, image_credits_cost')
        .eq('key_name', 'AUDIO_STORY_CREDITS')
        .maybeSingle();
      
      if (error) throw error;
      
      return {
        storyCredits: 1,
        audioCredits: config?.audio_credits_cost || 3,
        imageCredits: config?.image_credits_cost || 5
      };
    }
  });

  const totalCredits = (creditCosts?.storyCredits || 1) + 
                      (creditCosts?.audioCredits || 3) + 
                      (creditCosts?.imageCredits || 5);

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
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
        <NavigationBar onLogout={() => {}} />
        <div className="container mx-auto px-4 py-8 flex justify-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => {}} />
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
          <AgeGroupSelector
            ageGroups={KIDS_AGE_GROUPS}
            selectedAgeGroup={ageGroup}
            onSelect={(selected) => {
              setAgeGroup(selected);
              setStep(2);
            }}
          />
        ) : (
          <>
            <StoryTypeSelector
              storyTypes={KIDS_STORY_TYPES[ageGroup as keyof typeof KIDS_STORY_TYPES]}
              selectedType={storyType}
              onSelect={setStoryType}
            />
            
            {storyType && (
              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => setShowConfirmDialog(true)}
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
          </>
        )}

        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleGenerate}
          totalCredits={totalCredits}
        />
      </div>
    </div>
  );
};

export default KidsStoryCreator;
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KidsStoryCreator = () => {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const { toast } = useToast();

  // Fetch credit costs
  const { data: creditCosts } = useQuery({
    queryKey: ['credit-costs'],
    queryFn: async () => {
      const { data: config, error } = await supabase
        .from('api_configurations')
        .select('audio_credits_cost, image_credits_cost, kids_story_credits_cost')
        .eq('key_name', 'AUDIO_STORY_CREDITS')
        .maybeSingle();
      
      if (error) throw error;
      
      return {
        storyCredits: config?.kids_story_credits_cost || 1,
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

      // Step 1: Generate Story Text
      setGenerationStep("Crafting your magical story...");
      const storyResponse = await supabase.functions.invoke('generate-story', {
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

      if (storyResponse.error) throw new Error(storyResponse.error.message);
      const story = storyResponse.data.story;
      const imagePrompt = storyResponse.data.imagePrompt;

      // Save the story first
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title: story.split('\n')[0],
          content: story,
          age_group: ageGroup,
          genre: storyType,
          moral: "being kind and helpful",
          author_id: session.user.id,
          image_prompt: imagePrompt
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Step 2: Generate Image
      setGenerationStep("Creating beautiful pictures...");
      const imageResponse = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: imagePrompt }
      });

      if (imageResponse.error) throw new Error(imageResponse.error.message);

      // Save the image
      if (imageResponse.data?.imageUrl) {
        await supabase
          .from('story_images')
          .insert({
            story_id: savedStory.id,
            user_id: session.user.id,
            image_url: imageResponse.data.imageUrl,
            credits_used: creditCosts?.imageCredits || 5
          });
      }

      // Step 3: Generate Audio
      setGenerationStep("Adding storyteller's voice...");
      const audioResponse = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: story,
          voice: "fable"
        }
      });

      if (audioResponse.error) throw new Error(audioResponse.error.message);

      // Save the audio
      if (audioResponse.data?.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioResponse.data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );

        const filename = `${crypto.randomUUID()}.mp3`;
        await supabase.storage
          .from('audio-stories')
          .upload(filename, audioBlob);

        await supabase
          .from('audio_stories')
          .insert({
            story_id: savedStory.id,
            user_id: session.user.id,
            audio_url: filename,
            voice_id: "fable",
            credits_used: creditCosts?.audioCredits || 3
          });
      }

      setGeneratedStory(story);
      toast({
        title: "Success!",
        description: "Your magical story is ready!",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
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

        {ageGroup && (
          <div className="flex justify-center mb-8">
            <Tabs value={ageGroup} onValueChange={setAgeGroup} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14">
                {KIDS_AGE_GROUPS.map((group) => (
                  <TabsTrigger
                    key={group.id}
                    value={group.id}
                    className="text-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="mr-2">{group.icon}</span>
                    {group.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

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
              <div className="flex flex-col items-center mt-8 space-y-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!storyType || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {generationStep || "Creating your story..."}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Create My Story!
                    </>
                  )}
                </Button>
                {isGenerating && (
                  <p className="text-muted-foreground animate-pulse">
                    {generationStep}
                  </p>
                )}
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
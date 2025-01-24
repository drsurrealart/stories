import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Story } from "@/components/Story";
import { NavigationBar } from "@/components/NavigationBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AGE_GROUPS = [
  { id: '5-7', label: '5-7 Years', icon: '🌟' },
  { id: '8-10', label: '8-10 Years', icon: '🌈' },
  { id: '11-12', label: '11-12 Years', icon: '⭐' },
];

const STORY_TYPES = {
  '5-7': [
    { id: 'animals', label: 'Animal Friends', icon: '🐾', description: 'Stories about friendly animals!' },
    { id: 'magic', label: 'Magic & Wonder', icon: '✨', description: 'Discover magical adventures!' },
    { id: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦', description: 'Stories about family time!' },
    { id: 'nature', label: 'Nature Tales', icon: '🌳', description: 'Explore the outdoors!' },
    { id: 'bedtime', label: 'Bedtime Stories', icon: '🌙', description: 'Perfect for sleepy time!' },
    { id: 'friendship', label: 'Best Friends', icon: '🤝', description: 'Stories about friendship!' },
  ],
  '8-10': [
    { id: 'adventure', label: 'Epic Adventures', icon: '🗺️', description: 'Go on exciting quests!' },
    { id: 'mystery', label: 'Mystery Stories', icon: '🔍', description: 'Solve fun mysteries!' },
    { id: 'science', label: 'Science Fun', icon: '🔬', description: 'Discover cool science!' },
    { id: 'sports', label: 'Sports Stories', icon: '⚽', description: 'Athletic adventures!' },
    { id: 'fantasy', label: 'Fantasy Worlds', icon: '🏰', description: 'Visit magical places!' },
    { id: 'school', label: 'School Days', icon: '📚', description: 'Fun school stories!' },
  ],
  '11-12': [
    { id: 'action', label: 'Action Heroes', icon: '🦸‍♂️', description: 'Be a hero!' },
    { id: 'space', label: 'Space Explorer', icon: '🚀', description: 'Journey to the stars!' },
    { id: 'detective', label: 'Detective Tales', icon: '🕵️‍♂️', description: 'Solve mysteries!' },
    { id: 'mythology', label: 'Myth & Legend', icon: '🐉', description: 'Ancient tales!' },
    { id: 'technology', label: 'Tech Adventures', icon: '🤖', description: 'Digital quests!' },
    { id: 'survival', label: 'Survival Stories', icon: '🏕️', description: 'Outdoor challenges!' },
  ],
};

const KidsStoryCreator = () => {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  // Fetch credit costs
  const { data: creditCosts } = useQuery({
    queryKey: ['credit-costs'],
    queryFn: async () => {
      const { data: config } = await supabase
        .from('api_configurations')
        .select('audio_credits_cost, image_credits_cost')
        .single();
      
      return {
        storyCredits: 1, // Base story creation cost
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

  const handleCreateStory = () => {
    setShowConfirmDialog(true);
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
            {STORY_TYPES[ageGroup as keyof typeof STORY_TYPES].map((type) => (
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
              onClick={handleCreateStory}
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

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">Ready to Create Your Story?</AlertDialogTitle>
              <AlertDialogDescription className="text-lg space-y-4">
                <p>Make sure you have your parent's permission! 🌟</p>
                <p>This will use {totalCredits} credits to create:</p>
                <ul className="list-disc pl-6">
                  <li>Your story ({creditCosts?.storyCredits || 1} credit)</li>
                  <li>An audio version to listen to ({creditCosts?.audioCredits || 3} credits)</li>
                  <li>A special picture for your story ({creditCosts?.imageCredits || 5} credits)</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-lg">Not Yet</AlertDialogCancel>
              <AlertDialogAction 
                className="text-lg"
                onClick={handleGenerate}
              >
                Yes, Create My Story!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default KidsStoryCreator;
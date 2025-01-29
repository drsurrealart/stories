import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoryTypeSelector } from "./StoryTypeSelector";
import { GenerateStoryButton } from "./GenerateStoryButton";
import { AgeGroupTabs } from "./AgeGroupTabs";
import { moralsByAge } from "@/data/storyOptions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StoryGeneratorProps {
  onStoryGenerated: (story: any) => void;
}

export function StoryGenerator({ onStoryGenerated }: StoryGeneratorProps) {
  const [ageGroup, setAgeGroup] = useState("5-7");
  const [storyType, setStoryType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user profiles
  const { data: userProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: profiles } = await supabase
        .from('user_sub_profiles')
        .select('*')
        .eq('user_id', session.user.id);

      return profiles || [];
    }
  });

  // Fetch voice preferences for the selected profile
  const { data: voicePreference } = useQuery({
    queryKey: ['voice-preference', selectedProfileId],
    queryFn: async () => {
      if (!selectedProfileId) return null;

      const { data } = await supabase
        .from('voice_preferences')
        .select('voice_id')
        .eq('profile_id', selectedProfileId)
        .single();

      return data?.voice_id || null;
    },
    enabled: !!selectedProfileId
  });

  // Fetch kids mode voice preference if no profile is selected
  const { data: kidsVoicePreference } = useQuery({
    queryKey: ['kids-voice-preference'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('voice_preferences')
        .select('voice_id')
        .eq('profile_id', 'kids')
        .eq('user_id', session.user.id)
        .single();

      return data?.voice_id || null;
    }
  });

  const getRandomMoral = (ageGroup: string) => {
    // Map kids age groups to database age groups
    const dbAgeGroup = mapAgeGroupToDbGroup(ageGroup);
    // Get morals for the age group
    const morals = moralsByAge[dbAgeGroup];
    // Select a random moral
    const randomMoral = morals[Math.floor(Math.random() * morals.length)];
    return randomMoral.value;
  };

  const generateStory = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep("Creating your magical story...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to create stories",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const dbAgeGroup = mapAgeGroupToDbGroup(ageGroup);
      const randomMoral = getRandomMoral(ageGroup);

      // Get selected profile details if one is selected
      let selectedProfile = null;
      if (selectedProfileId && userProfiles) {
        selectedProfile = userProfiles.find(p => p.id === selectedProfileId);
      }

      // Determine which voice to use
      const voiceToUse = selectedProfileId 
        ? (voicePreference || 'fable') // Use profile preference or default to fable
        : (kidsVoicePreference || 'fable'); // Use kids mode preference or default to fable

      const response = await supabase.functions.invoke('generate-story', {
        body: { 
          preferences: {
            ageGroup: dbAgeGroup,
            genre: storyType,
            moral: randomMoral,
            lengthPreference: 'short',
            language: 'english',
            tone: 'playful',
            readingLevel: 'beginner',
            selectedProfile: selectedProfile ? {
              name: selectedProfile.name,
              age: selectedProfile.age,
              gender: selectedProfile.gender,
              ethnicity: selectedProfile.ethnicity,
              hairColor: selectedProfile.hair_color,
              interests: selectedProfile.interests || [],
            } : null,
            useProfileName: true, // Always use profile name in kids mode if profile is selected
            voice: voiceToUse // Add the voice preference to the story generation
          },
          mode: 'kids'
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate story");
      }

      const { story, enrichment, imagePrompt } = response.data;
      
      const parts = story.split("Moral:");
      const storyContent = parts[0].trim();
      const moral = parts[1]?.trim() || "";
      
      const titleMatch = storyContent.match(/^(.+?)\n/);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
      const contentWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();
      
      const timestamp = new Date().getTime();
      const slug = `${title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${timestamp}`;
      
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title,
          content: contentWithoutTitle,
          moral: moral,
          age_group: dbAgeGroup,
          genre: storyType,
          author_id: session.user.id,
          image_prompt: imagePrompt,
          reflection_questions: enrichment?.reflection_questions || [],
          action_steps: enrichment?.action_steps || [],
          related_quote: enrichment?.related_quote || '',
          discussion_prompts: enrichment?.discussion_prompts || [],
          slug
        })
        .select()
        .single();

      if (saveError) throw saveError;

      onStoryGenerated(savedStory);
      
      toast({
        title: "Story created!",
        description: "Your magical story has been created successfully.",
      });

    } catch (error: any) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <div className="space-y-8">
      <AgeGroupTabs
        selectedAgeGroup={ageGroup}
        onAgeGroupChange={setAgeGroup}
      />
      
      {userProfiles && userProfiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userProfiles.map((profile) => (
            <Card
              key={profile.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedProfileId === profile.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedProfileId(
                selectedProfileId === profile.id ? null : profile.id
              )}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserRound className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.age} years old
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <StoryTypeSelector
        selectedType={storyType}
        onSelect={setStoryType}
        ageGroup={ageGroup}
        disabled={isGenerating}
      />
      
      <GenerateStoryButton
        storyType={storyType}
        isGenerating={isGenerating}
        onClick={generateStory}
        generationStep={generationStep}
      />
    </div>
  );
}

// Helper function to map UI age groups to database age groups
const mapAgeGroupToDbGroup = (uiAgeGroup: string): string => {
  switch (uiAgeGroup) {
    case '5-7':
      return 'preschool';
    case '8-10':
      return 'elementary';
    case '11-12':
      return 'tween';
    default:
      return 'preschool';
  }
};
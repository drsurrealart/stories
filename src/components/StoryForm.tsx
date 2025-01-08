import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ageGroups = [
  { value: "preschool", label: "Preschool (3-5)" },
  { value: "elementary", label: "Elementary (6-8)" },
  { value: "tween", label: "Tween (9-12)" },
  { value: "teen", label: "Teen (13-17)" },
];

const genresByAge = {
  preschool: [
    { value: "fantasy", label: "Fantasy" },
    { value: "adventure", label: "Adventure" },
    { value: "animals", label: "Animal Stories" },
    { value: "bedtime", label: "Bedtime Stories" },
    { value: "fairytale", label: "Fairy Tales" },
    { value: "nature", label: "Nature Stories" },
    { value: "family", label: "Family Stories" },
    { value: "friendship", label: "Friendship Tales" },
  ],
  elementary: [
    { value: "fantasy", label: "Fantasy" },
    { value: "adventure", label: "Adventure" },
    { value: "mystery", label: "Mystery" },
    { value: "humor", label: "Humor" },
    { value: "historical", label: "Historical Fiction" },
    { value: "sports", label: "Sports Stories" },
    { value: "school", label: "School Stories" },
    { value: "science", label: "Science Adventures" },
    { value: "mythology", label: "Mythology" },
    { value: "superhero", label: "Superhero Stories" },
  ],
  tween: [
    { value: "fantasy", label: "Fantasy" },
    { value: "scifi", label: "Science Fiction" },
    { value: "adventure", label: "Adventure" },
    { value: "mystery", label: "Mystery" },
    { value: "historical", label: "Historical Fiction" },
    { value: "contemporary", label: "Contemporary Fiction" },
    { value: "comedy", label: "Comedy" },
    { value: "action", label: "Action" },
    { value: "survival", label: "Survival Stories" },
    { value: "sports", label: "Sports Fiction" },
    { value: "mythology", label: "Mythology" },
    { value: "detective", label: "Detective Stories" },
  ],
  teen: [
    { value: "fantasy", label: "Fantasy" },
    { value: "scifi", label: "Science Fiction" },
    { value: "adventure", label: "Adventure" },
    { value: "mystery", label: "Mystery" },
    { value: "contemporary", label: "Contemporary Fiction" },
    { value: "romance", label: "Romance" },
    { value: "thriller", label: "Thriller" },
    { value: "dystopian", label: "Dystopian" },
    { value: "historical", label: "Historical Fiction" },
    { value: "paranormal", label: "Paranormal" },
    { value: "psychological", label: "Psychological Fiction" },
    { value: "social", label: "Social Issues" },
    { value: "coming-of-age", label: "Coming of Age" },
    { value: "urban-fantasy", label: "Urban Fantasy" },
  ],
};

const moralsByAge = {
  preschool: [
    { value: "kindness", label: "Kindness" },
    { value: "sharing", label: "Sharing" },
    { value: "friendship", label: "Friendship" },
    { value: "patience", label: "Patience" },
    { value: "listening", label: "Good Listening" },
    { value: "manners", label: "Good Manners" },
    { value: "helping", label: "Helping Others" },
    { value: "emotions", label: "Understanding Emotions" },
    { value: "family", label: "Family Love" },
    { value: "trying", label: "Trying Your Best" },
  ],
  elementary: [
    { value: "kindness", label: "Kindness" },
    { value: "honesty", label: "Honesty" },
    { value: "friendship", label: "Friendship" },
    { value: "responsibility", label: "Responsibility" },
    { value: "teamwork", label: "Teamwork" },
    { value: "respect", label: "Respect for Others" },
    { value: "courage", label: "Courage" },
    { value: "perseverance", label: "Perseverance" },
    { value: "forgiveness", label: "Forgiveness" },
    { value: "gratitude", label: "Gratitude" },
    { value: "inclusion", label: "Including Others" },
    { value: "environmental", label: "Environmental Care" },
  ],
  tween: [
    { value: "honesty", label: "Honesty" },
    { value: "courage", label: "Courage" },
    { value: "responsibility", label: "Responsibility" },
    { value: "perseverance", label: "Perseverance" },
    { value: "integrity", label: "Integrity" },
    { value: "leadership", label: "Leadership" },
    { value: "empathy", label: "Empathy" },
    { value: "self-confidence", label: "Self-Confidence" },
    { value: "justice", label: "Justice" },
    { value: "diversity", label: "Embracing Diversity" },
    { value: "critical-thinking", label: "Critical Thinking" },
    { value: "resilience", label: "Resilience" },
    { value: "goal-setting", label: "Goal Setting" },
    { value: "digital-citizenship", label: "Digital Citizenship" },
  ],
  teen: [
    { value: "courage", label: "Courage" },
    { value: "responsibility", label: "Responsibility" },
    { value: "integrity", label: "Integrity" },
    { value: "empathy", label: "Empathy" },
    { value: "self-discovery", label: "Self-Discovery" },
    { value: "social-justice", label: "Social Justice" },
    { value: "mental-health", label: "Mental Health Awareness" },
    { value: "relationships", label: "Healthy Relationships" },
    { value: "identity", label: "Identity & Acceptance" },
    { value: "decision-making", label: "Decision Making" },
    { value: "global-awareness", label: "Global Awareness" },
    { value: "resilience", label: "Resilience" },
    { value: "leadership", label: "Leadership" },
    { value: "ethics", label: "Ethics & Morality" },
    { value: "civic-duty", label: "Civic Responsibility" },
  ],
};

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

  const availableGenres = useMemo(() => {
    return preferences.ageGroup ? genresByAge[preferences.ageGroup as keyof typeof genresByAge] : [];
  }, [preferences.ageGroup]);

  const availableMorals = useMemo(() => {
    return preferences.ageGroup ? moralsByAge[preferences.ageGroup as keyof typeof moralsByAge] : [];
  }, [preferences.ageGroup]);

  const handleAgeGroupChange = (value: string) => {
    setPreferences({
      ageGroup: value,
      genre: "",
      moral: "",
    });
  };

  const handleSubmit = () => {
    if (!preferences.genre || !preferences.ageGroup || !preferences.moral) {
      toast({
        title: "Please fill in all fields",
        description: "We need these details to create your perfect story!",
        variant: "destructive",
      });
      return;
    }
    onSubmit(preferences);
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Create Your Story</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Age group</label>
          <Select
            value={preferences.ageGroup}
            onValueChange={handleAgeGroupChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              {ageGroups.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {preferences.ageGroup && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose your genre</label>
            <Select
              value={preferences.genre}
              onValueChange={(value) => setPreferences({ ...preferences, genre: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {availableGenres.map((genre) => (
                  <SelectItem key={genre.value} value={genre.value}>
                    {genre.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {preferences.ageGroup && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose a moral lesson</label>
            <Select
              value={preferences.moral}
              onValueChange={(value) => setPreferences({ ...preferences, moral: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a moral" />
              </SelectTrigger>
              <SelectContent>
                {availableMorals.map((moral) => (
                  <SelectItem key={moral.value} value={moral.value}>
                    {moral.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

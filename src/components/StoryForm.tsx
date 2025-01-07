import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const genres = [
  { value: "fantasy", label: "Fantasy" },
  { value: "scifi", label: "Science Fiction" },
  { value: "adventure", label: "Adventure" },
  { value: "mystery", label: "Mystery" },
];

const ageGroups = [
  { value: "preschool", label: "Preschool (3-5)" },
  { value: "elementary", label: "Elementary (6-8)" },
  { value: "tween", label: "Tween (9-12)" },
  { value: "teen", label: "Teen (13-17)" },
];

const morals = [
  { value: "kindness", label: "Kindness" },
  { value: "honesty", label: "Honesty" },
  { value: "courage", label: "Courage" },
  { value: "responsibility", label: "Responsibility" },
  { value: "friendship", label: "Friendship" },
];

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
          <label className="text-sm font-medium">Choose your genre</label>
          <Select
            value={preferences.genre}
            onValueChange={(value) => setPreferences({ ...preferences, genre: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Age group</label>
          <Select
            value={preferences.ageGroup}
            onValueChange={(value) => setPreferences({ ...preferences, ageGroup: value })}
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
              {morals.map((moral) => (
                <SelectItem key={moral.value} value={moral.value}>
                  {moral.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
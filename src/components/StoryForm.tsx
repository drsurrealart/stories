import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AgeGroupSelect } from "./story/AgeGroupSelect";
import { GenreSelect } from "./story/GenreSelect";
import { MoralSelect } from "./story/MoralSelect";

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
    <Card className="w-full max-w-md p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in mx-4 md:mx-0">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">Create Your Story</h2>
      </div>

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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KIDS_AGE_GROUPS, KIDS_STORY_TYPES } from "@/data/storyOptions";

interface StoryCreatorStepsProps {
  ageGroup: string;
  storyType: string;
  onAgeGroupSelect: (value: string) => void;
  onStoryTypeSelect: (value: string) => void;
}

export function StoryCreatorSteps({ 
  ageGroup, 
  storyType, 
  onAgeGroupSelect, 
  onStoryTypeSelect 
}: StoryCreatorStepsProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {KIDS_AGE_GROUPS.map((group) => (
            <Button
              key={group.id}
              variant={ageGroup === group.id ? "default" : "outline"}
              size="lg"
              className="flex flex-col items-center p-4 h-auto gap-2 transition-all hover:scale-105"
              onClick={() => {
                onAgeGroupSelect(group.id);
                setStep(2);
              }}
            >
              <span className="text-3xl">{group.icon}</span>
              <span className="text-sm text-center font-semibold">{group.label}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KIDS_STORY_TYPES[ageGroup as keyof typeof KIDS_STORY_TYPES]?.map((type) => (
            <Button
              key={type.id}
              variant={storyType === type.id ? "default" : "outline"}
              size="lg"
              className="flex flex-col items-center p-4 h-auto gap-2 transition-all hover:scale-105"
              onClick={() => onStoryTypeSelect(type.id)}
            >
              <span className="text-3xl">{type.icon}</span>
              <span className="text-base font-semibold">{type.label}</span>
              <p className="text-sm text-muted-foreground text-center">{type.description}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
import { Card } from "@/components/ui/card";
import { KIDS_STORY_TYPES } from "@/data/storyOptions";

interface StoryType {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
}

interface StoryTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
  disabled?: boolean;
}

export function StoryTypeSelector({ selectedType, onSelect, disabled = false }: StoryTypeSelectorProps) {
  // Get story types for 5-7 age group as default
  const storyTypes = KIDS_STORY_TYPES['5-7'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {storyTypes.map((type) => (
        <Card
          key={type.id}
          className={`p-6 cursor-pointer transition-all hover:scale-105 ${
            selectedType === type.id ? 'ring-2 ring-primary' : ''
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => !disabled && onSelect(type.id)}
        >
          <div className="text-center space-y-4">
            <div className="text-4xl">{type.icon}</div>
            <h3 className="text-xl font-bold">{type.label}</h3>
            <p className="text-muted-foreground">{type.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
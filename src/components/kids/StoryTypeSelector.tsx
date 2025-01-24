import { Card } from "@/components/ui/card";

interface StoryType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface StoryTypeSelectorProps {
  storyTypes: StoryType[];
  selectedType: string;
  onSelect: (type: string) => void;
}

export function StoryTypeSelector({ storyTypes, selectedType, onSelect }: StoryTypeSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {storyTypes.map((type) => (
        <Card
          key={type.id}
          className={`p-6 cursor-pointer transition-all hover:scale-105 ${
            selectedType === type.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(type.id)}
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
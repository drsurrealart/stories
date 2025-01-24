import { Card } from "@/components/ui/card";

interface AgeGroup {
  id: string;
  label: string;
  icon: string;
}

interface AgeGroupSelectorProps {
  ageGroups: AgeGroup[];
  selectedAgeGroup: string;
  onSelect: (ageGroup: string) => void;
}

export function AgeGroupSelector({ ageGroups, selectedAgeGroup, onSelect }: AgeGroupSelectorProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {ageGroups.map((group) => (
        <Card
          key={group.id}
          className={`p-6 cursor-pointer transition-all hover:scale-105 ${
            selectedAgeGroup === group.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(group.id)}
        >
          <div className="text-center space-y-4">
            <div className="text-4xl">{group.icon}</div>
            <h3 className="text-xl font-bold">{group.label}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
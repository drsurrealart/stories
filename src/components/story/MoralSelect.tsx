import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { moralsByAge } from "@/data/storyOptions";

interface MoralSelectProps {
  value: string;
  onChange: (value: string) => void;
  ageGroup: string;
}

export function MoralSelect({ value, onChange, ageGroup }: MoralSelectProps) {
  const morals = ageGroup ? moralsByAge[ageGroup as keyof typeof moralsByAge] : [];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choose a moral lesson</label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
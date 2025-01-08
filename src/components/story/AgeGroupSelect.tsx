import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ageGroups } from "@/data/storyOptions";

interface AgeGroupSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function AgeGroupSelect({ value, onChange }: AgeGroupSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Age group</label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
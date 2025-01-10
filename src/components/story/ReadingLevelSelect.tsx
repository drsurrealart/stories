import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReadingLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReadingLevelSelect({ value, onChange }: ReadingLevelSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Reading Level</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="early_reader">Early Reader</SelectItem>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
          <SelectItem value="fluent">Fluent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
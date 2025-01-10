import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LengthPreferenceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function LengthPreferenceSelect({ value, onChange }: LengthPreferenceSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Story Length</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Short</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="long">Long</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
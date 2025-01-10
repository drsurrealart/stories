import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ToneSelect({ value, onChange }: ToneSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Story Tone</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="funny">Funny</SelectItem>
          <SelectItem value="adventurous">Adventurous</SelectItem>
          <SelectItem value="emotional">Emotional</SelectItem>
          <SelectItem value="educational">Educational</SelectItem>
          <SelectItem value="suspenseful">Suspenseful</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
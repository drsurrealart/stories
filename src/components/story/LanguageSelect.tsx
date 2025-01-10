import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Language</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="french">French</SelectItem>
          <SelectItem value="german">German</SelectItem>
          <SelectItem value="italian">Italian</SelectItem>
          <SelectItem value="portuguese">Portuguese</SelectItem>
          <SelectItem value="chinese">Chinese</SelectItem>
          <SelectItem value="japanese">Japanese</SelectItem>
          <SelectItem value="korean">Korean</SelectItem>
          <SelectItem value="russian">Russian</SelectItem>
          <SelectItem value="arabic">Arabic</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PoeticStyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PoeticStyleSelect({ value, onChange }: PoeticStyleSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Poetic Style</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="prose">Prose</SelectItem>
          <SelectItem value="rhyming">Rhyming</SelectItem>
          <SelectItem value="haiku">Haiku</SelectItem>
          <SelectItem value="limerick">Limerick</SelectItem>
          <SelectItem value="free_verse">Free Verse</SelectItem>
          <SelectItem value="narrative_poem">Narrative Poem</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
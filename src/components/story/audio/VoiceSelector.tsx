import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy (Neutral)', gender: 'neutral' },
  { id: 'echo', name: 'Echo (Male)', gender: 'male' },
  { id: 'fable', name: 'Fable (Female)', gender: 'female' },
  { id: 'onyx', name: 'Onyx (Male)', gender: 'male' },
  { id: 'nova', name: 'Nova (Female)', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer (Female)', gender: 'female' },
];

export function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  return (
    <Select value={selectedVoice} onValueChange={onVoiceChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {VOICE_OPTIONS.map((voice) => (
          <SelectItem key={voice.id} value={voice.id}>
            {voice.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
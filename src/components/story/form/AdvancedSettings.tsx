import { CharacterNameInput } from "../CharacterNameInput";
import { LengthPreferenceSelect } from "../LengthPreferenceSelect";
import { LanguageSelect } from "../LanguageSelect";
import { ToneSelect } from "../ToneSelect";

interface AdvancedSettingsProps {
  characterName1: string;
  characterName2: string;
  lengthPreference: string;
  language: string;
  tone: string;
  onCharacterName1Change: (value: string) => void;
  onCharacterName2Change: (value: string) => void;
  onLengthPreferenceChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onToneChange: (value: string) => void;
}

export function AdvancedSettings({
  characterName1,
  characterName2,
  lengthPreference,
  language,
  tone,
  onCharacterName1Change,
  onCharacterName2Change,
  onLengthPreferenceChange,
  onLanguageChange,
  onToneChange,
}: AdvancedSettingsProps) {
  return (
    <div className="space-y-4">
      <CharacterNameInput
        id="characterName1"
        label="Character Name 1 (Optional)"
        value={characterName1}
        onChange={onCharacterName1Change}
      />

      <CharacterNameInput
        id="characterName2"
        label="Character Name 2 (Optional)"
        value={characterName2}
        onChange={onCharacterName2Change}
      />

      <LengthPreferenceSelect
        value={lengthPreference}
        onChange={onLengthPreferenceChange}
      />

      <LanguageSelect
        value={language}
        onChange={onLanguageChange}
      />

      <ToneSelect
        value={tone}
        onChange={onToneChange}
      />
    </div>
  );
}
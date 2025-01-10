import { AgeGroupSelect } from "../AgeGroupSelect";
import { GenreSelect } from "../GenreSelect";
import { MoralSelect } from "../MoralSelect";

interface BasicSettingsProps {
  ageGroup: string;
  genre: string;
  moral: string;
  onAgeGroupChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onMoralChange: (value: string) => void;
}

export function BasicSettings({
  ageGroup,
  genre,
  moral,
  onAgeGroupChange,
  onGenreChange,
  onMoralChange,
}: BasicSettingsProps) {
  return (
    <div className="space-y-4">
      <AgeGroupSelect value={ageGroup} onChange={onAgeGroupChange} />

      {ageGroup && (
        <GenreSelect
          value={genre}
          onChange={onGenreChange}
          ageGroup={ageGroup}
        />
      )}

      {ageGroup && (
        <MoralSelect
          value={moral}
          onChange={onMoralChange}
          ageGroup={ageGroup}
        />
      )}
    </div>
  );
}
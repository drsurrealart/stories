import { Card } from "@/components/ui/card";
import { KIDS_STORY_TYPES } from "@/data/storyOptions";
import { genresByAge } from "@/data/storyOptions";

interface StoryType {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
}

interface StoryTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
  ageGroup: string;
  disabled?: boolean;
}

// Helper function to map UI age groups to database age groups
const mapAgeGroupToDbGroup = (uiAgeGroup: string): string => {
  switch (uiAgeGroup) {
    case '5-7':
      return 'preschool';
    case '8-10':
      return 'elementary';
    case '11-12':
      return 'tween';
    default:
      return 'preschool';
  }
};

export function StoryTypeSelector({ selectedType, onSelect, ageGroup, disabled = false }: StoryTypeSelectorProps) {
  const dbAgeGroup = mapAgeGroupToDbGroup(ageGroup);
  const genres = genresByAge[dbAgeGroup as keyof typeof genresByAge] || [];

  // Convert database genres to story type format
  const storyTypes = genres.map(genre => ({
    id: genre.value,
    label: genre.label,
    icon: getGenreIcon(genre.value),
    description: getGenreDescription(genre.value)
  }));

  if (!storyTypes || storyTypes.length === 0) {
    console.error("Story types not found for age group", ageGroup);
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {storyTypes.map((type) => (
        <Card
          key={type.id}
          className={`p-6 cursor-pointer transition-all hover:scale-105 ${
            selectedType === type.id ? 'ring-2 ring-primary' : ''
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => !disabled && onSelect(type.id)}
        >
          <div className="text-center space-y-4">
            <div className="text-4xl">{type.icon}</div>
            <h3 className="text-xl font-bold">{type.label}</h3>
            <p className="text-muted-foreground">{type.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper function to get appropriate icon for each genre
function getGenreIcon(genre: string): string {
  const icons: Record<string, string> = {
    bedtime: '🌙',
    animals: '🐾',
    family: '👨‍👩‍👧‍👦',
    nature: '🌳',
    adventure: '🗺️',
    mystery: '🔍',
    fairytale: '🏰',
    sports: '⚽',
    school: '📚',
    science: '🔬',
    fantasy: '✨',
    action: '🦸‍♂️',
    space: '🚀',
    detective: '🕵️‍♂️',
    mythology: '🐉',
    survival: '🏕️',
    // Add more mappings as needed
    default: '📖'
  };
  return icons[genre] || icons.default;
}

// Helper function to get description for each genre
function getGenreDescription(genre: string): string {
  const descriptions: Record<string, string> = {
    bedtime: 'Perfect for sleepy time!',
    animals: 'Adventures with furry friends',
    family: 'Stories about family time',
    nature: 'Explore the outdoors',
    adventure: 'Epic quests and journeys',
    mystery: 'Solve exciting mysteries',
    fairytale: 'Magical fairy tales',
    sports: 'Fun sports stories',
    school: 'School day adventures',
    science: 'Discover cool science',
    fantasy: 'Magical adventures',
    action: 'Exciting hero stories',
    space: 'Journey to the stars',
    detective: 'Solve mysteries',
    mythology: 'Ancient tales',
    survival: 'Outdoor challenges',
    // Add more descriptions as needed
    default: 'An exciting story adventure!'
  };
  return descriptions[genre] || descriptions.default;
}
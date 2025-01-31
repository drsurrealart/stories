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

function getGenreDescription(genre: string): string {
  const descriptions: Record<string, string> = {
    bedtime: 'Cozy stories perfect for winding down before sleep',
    animals: 'Meet and learn about amazing animal friends',
    family: 'Heartwarming tales about family bonds and togetherness',
    nature: 'Discover the wonders of the natural world',
    counting: 'Fun stories that make learning numbers exciting',
    colors: 'Vibrant adventures exploring the world of colors',
    shapes: 'Journey through the fascinating world of shapes',
    nursery: 'Classic rhymes with a modern, fun twist',
    'magic-garden': 'Enchanting stories from a magical garden',
    'friendly-monsters': 'Meet lovable, not-so-scary monster friends',
    dinosaurs: 'Roar into prehistoric adventures with dinosaurs',
    'ocean-friends': 'Dive into underwater adventures with sea creatures',
    adventure: 'Epic quests and thrilling journeys',
    mystery: 'Solve exciting mysteries and puzzles',
    fairytale: 'Magical stories with enchanting characters',
    sports: 'Action-packed tales of teamwork and triumph',
    school: 'Fun and relatable school day stories',
    science: 'Fascinating discoveries and experiments',
    fantasy: 'Journey to magical worlds of wonder',
    action: 'Thrilling adventures with brave heroes',
    space: 'Blast off into cosmic discoveries',
    detective: 'Uncover clues and solve mysteries',
    mythology: 'Ancient tales of gods and heroes',
    survival: 'Stories of courage and perseverance',
    'best-friends': 'Heartwarming tales of friendship and fun',
    'tech-adventures': 'Exciting journeys into the digital world',
    'eco-warriors': 'Adventures in protecting our planet',
    'silly-stories': 'Wacky tales full of giggles and silly surprises',
    'kitchen-magic': 'Whimsical cooking adventures and tasty mysteries',
    'pet-adventures': 'Exciting stories of amazing animal companions',
    'time-travelers': 'Mind-bending adventures through history and time',
    'laugh-out-loud': 'Side-splitting stories and hilarious escapades',
    'tech-tales': 'High-tech adventures in the digital frontier',
    'time-travel': 'Journey through different time periods',
    'magic': 'Discover enchanting magical powers',
    'friendship': 'Stories about making and keeping friends',
    'technology': 'Explore amazing technological wonders',
    'superhero': 'Become a hero and save the day',
    'science-club': 'Join exciting scientific discoveries',
    'gaming': 'Adventures in virtual worlds',
    default: 'An exciting story adventure!'
  };
  return descriptions[genre] || descriptions.default;
}

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

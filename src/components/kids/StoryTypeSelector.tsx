import { Card } from "@/components/ui/card";
import { genresByAge } from "@/data/storyOptions";
import { 
  Moon, Paw, Users, Tree, Hash, Palette, Square, Music, 
  Flower2, Ghost, Footprints, Fish, Map, Search, Wand2, 
  Laugh, Trophy, GraduationCap, FlaskConical, Sparkles, 
  Clock, Rocket, Dog, Utensils, Sword, Heart, Magnifier, 
  Scroll, Tent, Clock3, Zap, Theater, Microscope, 
  Gamepad2, Leaf, Laptop, BookOpen 
} from "lucide-react";

interface StoryTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
  ageGroup: string;
  disabled?: boolean;
}

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

  if (!genres || genres.length === 0) {
    console.error("Story types not found for age group", ageGroup);
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {genres.map((type) => (
        <Card
          key={type.value}
          className={`p-6 cursor-pointer transition-all hover:scale-105 ${
            selectedType === type.value ? 'ring-2 ring-primary' : ''
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => !disabled && onSelect(type.value)}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {getGenreIcon(type.value)}
            </div>
            <h3 className="text-xl font-bold">{type.label}</h3>
            <p className="text-muted-foreground text-sm">{type.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getGenreIcon(genre: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    // Preschool icons
    bedtime: <Moon className="w-8 h-8 text-indigo-500" />,
    animals: <Paw className="w-8 h-8 text-orange-500" />,
    family: <Users className="w-8 h-8 text-blue-500" />,
    nature: <Tree className="w-8 h-8 text-green-500" />,
    counting: <Hash className="w-8 h-8 text-purple-500" />,
    colors: <Palette className="w-8 h-8 text-pink-500" />,
    shapes: <Square className="w-8 h-8 text-yellow-500" />,
    nursery: <Music className="w-8 h-8 text-red-500" />,
    "magic-garden": <Flower2 className="w-8 h-8 text-emerald-500" />,
    "friendly-monsters": <Ghost className="w-8 h-8 text-violet-500" />,
    dinosaurs: <Footprints className="w-8 h-8 text-amber-500" />,
    "ocean-friends": <Fish className="w-8 h-8 text-cyan-500" />,
    
    // Elementary icons
    adventure: <Map className="w-8 h-8 text-amber-500" />,
    mystery: <Search className="w-8 h-8 text-purple-500" />,
    fairytale: <Wand2 className="w-8 h-8 text-pink-500" />,
    humor: <Laugh className="w-8 h-8 text-yellow-500" />,
    sports: <Trophy className="w-8 h-8 text-emerald-500" />,
    school: <GraduationCap className="w-8 h-8 text-blue-500" />,
    science: <FlaskConical className="w-8 h-8 text-indigo-500" />,
    superhero: <Sparkles className="w-8 h-8 text-red-500" />,
    "time-travel": <Clock className="w-8 h-8 text-cyan-500" />,
    space: <Rocket className="w-8 h-8 text-violet-500" />,
    pets: <Dog className="w-8 h-8 text-orange-500" />,
    cooking: <Utensils className="w-8 h-8 text-green-500" />,
    
    // Tween icons
    fantasy: <Sword className="w-8 h-8 text-violet-500" />,
    friendship: <Heart className="w-8 h-8 text-pink-500" />,
    detective: <Magnifier className="w-8 h-8 text-amber-500" />,
    mythology: <Scroll className="w-8 h-8 text-orange-500" />,
    survival: <Tent className="w-8 h-8 text-emerald-500" />,
    historical: <Clock3 className="w-8 h-8 text-cyan-500" />,
    action: <Zap className="w-8 h-8 text-yellow-500" />,
    comedy: <Theater className="w-8 h-8 text-red-500" />,
    "science-club": <Microscope className="w-8 h-8 text-indigo-500" />,
    gaming: <Gamepad2 className="w-8 h-8 text-purple-500" />,
    "eco-warriors": <Leaf className="w-8 h-8 text-green-500" />,
    "tech-tales": <Laptop className="w-8 h-8 text-blue-500" />,
  };
  
  return icons[genre] || <BookOpen className="w-8 h-8 text-gray-500" />;
}
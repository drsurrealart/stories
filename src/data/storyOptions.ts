import React from 'react';
import { 
  Moon, Paw, Users, Tree, Hash, Palette, Square, Music, 
  Flower2, Ghost, Footprints, Fish, Map, Search, Wand2, 
  Laugh, Trophy, GraduationCap, FlaskConical, Sparkles, 
  Clock, Rocket, Dog, Utensils, Sword, Heart, Magnifier, 
  Scroll, Tent, Clock3, Zap, Theater, Microscope, 
  Gamepad2, Leaf, Laptop, BookOpen 
} from 'lucide-react';

export const ageGroups = [
  { value: "preschool", label: "Preschool (3-5)" },
  { value: "elementary", label: "Elementary (6-8)" },
  { value: "tween", label: "Tween (9-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "adult", label: "Adult (18+)" },
];

export const genresByAge = {
  preschool: [
    { value: "bedtime", label: "Bedtime Stories", description: "Cozy tales perfect for winding down and sweet dreams" },
    { value: "animals", label: "Animal Adventures", description: "Fun stories about furry, feathered, and scaly friends" },
    { value: "family", label: "Family Fun", description: "Heartwarming tales about family time and togetherness" },
    { value: "nature", label: "Nature Discovery", description: "Explore the wonders of the natural world" },
    { value: "counting", label: "Counting Tales", description: "Make learning numbers fun and exciting" },
    { value: "colors", label: "Color Adventures", description: "Vibrant stories exploring the rainbow of colors" },
    { value: "shapes", label: "Shape Stories", description: "Journey through the world of shapes and patterns" },
    { value: "nursery", label: "Nursery Rhymes", description: "Classic rhymes with a modern twist" },
    { value: "magic-garden", label: "Magical Garden", description: "Enchanting tales from a whimsical garden" },
    { value: "friendly-monsters", label: "Friendly Monsters", description: "Meet lovable and silly monster friends" },
    { value: "dinosaurs", label: "Dinosaur Tales", description: "Roar-some adventures with prehistoric pals" },
    { value: "ocean-friends", label: "Ocean Friends", description: "Dive into underwater adventures" }
  ],
  elementary: [
    { value: "adventure", label: "Epic Adventures", description: "Thrilling quests and daring journeys" },
    { value: "mystery", label: "Junior Detective", description: "Solve exciting mysteries and puzzles" },
    { value: "fairytale", label: "Modern Fairy Tales", description: "Classic stories with contemporary twists" },
    { value: "humor", label: "Silly Stories", description: "Laugh-out-loud tales full of fun" },
    { value: "sports", label: "Sports Stories", description: "Action-packed tales of games and teamwork" },
    { value: "school", label: "School Adventures", description: "Fun stories about life at school" },
    { value: "science", label: "Science Explorer", description: "Discover amazing scientific wonders" },
    { value: "superhero", label: "Kid Superheroes", description: "Stories of young heroes saving the day" },
    { value: "time-travel", label: "Time Travel Tales", description: "Journey through different time periods" },
    { value: "space", label: "Space Journeys", description: "Blast off into cosmic adventures" },
    { value: "pets", label: "Pet Adventures", description: "Stories about our beloved animal companions" },
    { value: "cooking", label: "Kitchen Magic", description: "Delicious tales of culinary adventures" }
  ],
  tween: [
    { value: "fantasy", label: "Fantasy Realms", description: "Epic adventures in magical worlds" },
    { value: "friendship", label: "Friend Chronicles", description: "Stories about the power of friendship" },
    { value: "detective", label: "Mystery Solvers", description: "Unravel intriguing mysteries" },
    { value: "mythology", label: "Myth Quests", description: "Adventures inspired by ancient legends" },
    { value: "survival", label: "Survival Stories", description: "Tales of courage and resourcefulness" },
    { value: "historical", label: "Time Travelers", description: "Journey through fascinating historical periods" },
    { value: "action", label: "Action Heroes", description: "Exciting stories of bravery and adventure" },
    { value: "comedy", label: "Laugh Out Loud", description: "Hilarious tales that will make you giggle" },
    { value: "science-club", label: "Science Club", description: "Explore the wonders of science and discovery" },
    { value: "gaming", label: "Gaming Adventures", description: "Stories inspired by video game worlds" },
    { value: "eco-warriors", label: "Eco Warriors", description: "Save the planet with environmental heroes" },
    { value: "tech-tales", label: "Tech Tales", description: "Adventures in the digital world" }
  ]
};

type IconProps = {
  className?: string;
};

export const getGenreIcon = (genre: string): React.ReactElement => {
  const iconProps: IconProps = {
    className: "w-8 h-8"
  };

  const icons: Record<string, React.ReactElement> = {
    // Preschool icons
    bedtime: <Moon {...iconProps} className="w-8 h-8 text-indigo-500" />,
    animals: <Paw {...iconProps} className="w-8 h-8 text-orange-500" />,
    family: <Users {...iconProps} className="w-8 h-8 text-blue-500" />,
    nature: <Tree {...iconProps} className="w-8 h-8 text-green-500" />,
    counting: <Hash {...iconProps} className="w-8 h-8 text-purple-500" />,
    colors: <Palette {...iconProps} className="w-8 h-8 text-pink-500" />,
    shapes: <Square {...iconProps} className="w-8 h-8 text-yellow-500" />,
    nursery: <Music {...iconProps} className="w-8 h-8 text-red-500" />,
    "magic-garden": <Flower2 {...iconProps} className="w-8 h-8 text-emerald-500" />,
    "friendly-monsters": <Ghost {...iconProps} className="w-8 h-8 text-violet-500" />,
    dinosaurs: <Footprints {...iconProps} className="w-8 h-8 text-amber-500" />,
    "ocean-friends": <Fish {...iconProps} className="w-8 h-8 text-cyan-500" />,
    
    // Elementary icons
    adventure: <Map {...iconProps} className="w-8 h-8 text-amber-500" />,
    mystery: <Search {...iconProps} className="w-8 h-8 text-purple-500" />,
    fairytale: <Wand2 {...iconProps} className="w-8 h-8 text-pink-500" />,
    humor: <Laugh {...iconProps} className="w-8 h-8 text-yellow-500" />,
    sports: <Trophy {...iconProps} className="w-8 h-8 text-emerald-500" />,
    school: <GraduationCap {...iconProps} className="w-8 h-8 text-blue-500" />,
    science: <FlaskConical {...iconProps} className="w-8 h-8 text-indigo-500" />,
    superhero: <Sparkles {...iconProps} className="w-8 h-8 text-red-500" />,
    "time-travel": <Clock {...iconProps} className="w-8 h-8 text-cyan-500" />,
    space: <Rocket {...iconProps} className="w-8 h-8 text-violet-500" />,
    pets: <Dog {...iconProps} className="w-8 h-8 text-orange-500" />,
    cooking: <Utensils {...iconProps} className="w-8 h-8 text-green-500" />,
    
    // Tween icons
    fantasy: <Sword {...iconProps} className="w-8 h-8 text-violet-500" />,
    friendship: <Heart {...iconProps} className="w-8 h-8 text-pink-500" />,
    detective: <Magnifier {...iconProps} className="w-8 h-8 text-amber-500" />,
    mythology: <Scroll {...iconProps} className="w-8 h-8 text-orange-500" />,
    survival: <Tent {...iconProps} className="w-8 h-8 text-emerald-500" />,
    historical: <Clock3 {...iconProps} className="w-8 h-8 text-cyan-500" />,
    action: <Zap {...iconProps} className="w-8 h-8 text-yellow-500" />,
    comedy: <Theater {...iconProps} className="w-8 h-8 text-red-500" />,
    "science-club": <Microscope {...iconProps} className="w-8 h-8 text-indigo-500" />,
    gaming: <Gamepad2 {...iconProps} className="w-8 h-8 text-purple-500" />,
    "eco-warriors": <Leaf {...iconProps} className="w-8 h-8 text-green-500" />,
    "tech-tales": <Laptop {...iconProps} className="w-8 h-8 text-blue-500" />
  };
  
  return icons[genre] || <BookOpen className="w-8 h-8 text-gray-500" />;
};
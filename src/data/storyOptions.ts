export const ageGroups = [
  { value: "preschool", label: "Preschool (3-5)" },
  { value: "elementary", label: "Elementary (6-8)" },
  { value: "tween", label: "Tween (9-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "adult", label: "Adult (18+)" },
];

export const genresByAge = {
  preschool: [
    { value: "bedtime", label: "Bedtime Stories" },
    { value: "animals", label: "Animal Adventures" },
    { value: "family", label: "Family Fun" },
    { value: "nature", label: "Nature Discovery" },
    { value: "counting", label: "Counting Tales" },
    { value: "colors", label: "Color Adventures" },
    { value: "shapes", label: "Shape Stories" },
    { value: "nursery", label: "Nursery Rhymes" },
    { value: "magic-garden", label: "Magical Garden" },
    { value: "friendly-monsters", label: "Friendly Monsters" },
    { value: "dinosaurs", label: "Dinosaur Tales" },
    { value: "ocean-friends", label: "Ocean Friends" }
  ],
  elementary: [
    { value: "adventure", label: "Epic Adventures" },
    { value: "mystery", label: "Junior Detective" },
    { value: "fairytale", label: "Modern Fairy Tales" },
    { value: "humor", label: "Silly Stories" },
    { value: "sports", label: "Sports Stories" },
    { value: "school", label: "School Adventures" },
    { value: "science", label: "Science Explorer" },
    { value: "superhero", label: "Kid Superheroes" },
    { value: "time-travel", label: "Time Travel Tales" },
    { value: "space", label: "Space Journeys" },
    { value: "pets", label: "Pet Adventures" },
    { value: "cooking", label: "Kitchen Magic" }
  ],
  tween: [
    { value: "fantasy", label: "Fantasy Realms" },
    { value: "friendship", label: "Friend Chronicles" },
    { value: "detective", label: "Mystery Solvers" },
    { value: "mythology", label: "Myth Quests" },
    { value: "survival", label: "Survival Stories" },
    { value: "historical", label: "Time Travelers" },
    { value: "action", label: "Action Heroes" },
    { value: "comedy", label: "Laugh Out Loud" },
    { value: "science-club", label: "Science Club" },
    { value: "gaming", label: "Gaming Adventures" },
    { value: "eco-warriors", label: "Eco Warriors" },
    { value: "tech-tales", label: "Tech Tales" }
  ],
  teen: [
    { value: "scifi", label: "Sci-Fi Futures" },
    { value: "dystopian", label: "Dystopian Worlds" },
    { value: "coming-of-age", label: "Life Changes" },
    { value: "social-issues", label: "Real Talk" },
    { value: "romance", label: "First Love" },
    { value: "paranormal", label: "Supernatural" },
    { value: "urban-fantasy", label: "Urban Magic" },
    { value: "contemporary", label: "Modern Life" },
    { value: "music-scene", label: "Music Scene" },
    { value: "sports-drama", label: "Sports Drama" },
    { value: "art-world", label: "Creative Souls" },
    { value: "mystery-thriller", label: "Teen Thriller" }
  ],
  adult: [
    { value: "literary", label: "Literary Fiction" },
    { value: "psychological", label: "Psychological Drama" },
    { value: "political", label: "Political Intrigue" },
    { value: "philosophical", label: "Philosophical Tales" },
    { value: "magical-realism", label: "Magical Realism" },
    { value: "satire", label: "Modern Satire" },
    { value: "experimental", label: "Experimental Fiction" },
    { value: "historical-epic", label: "Historical Epic" },
    { value: "tech-noir", label: "Tech Noir" },
    { value: "eco-fiction", label: "Climate Fiction" },
    { value: "cultural", label: "Cultural Stories" },
    { value: "workplace", label: "Office Drama" }
  ],
};

export const moralsByAge = {
  preschool: [
    { value: "sharing", label: "Sharing is Caring" },
    { value: "kindness", label: "Being Kind to Others" },
    { value: "listening", label: "Good Listening" },
    { value: "manners", label: "Magic Words & Manners" },
    { value: "helping", label: "Helping Others" },
    { value: "emotions", label: "Understanding Feelings" },
    { value: "patience", label: "Waiting Your Turn" },
    { value: "trying", label: "Never Give Up" },
    { value: "friendship", label: "Making New Friends" },
    { value: "differences", label: "Everyone is Special" },
    { value: "creativity", label: "Using Imagination" },
    { value: "cleanup", label: "Cleaning Up Together" }
  ],
  elementary: [
    { value: "honesty", label: "Always Tell the Truth" },
    { value: "teamwork", label: "Working Together" },
    { value: "respect", label: "Respect for All" },
    { value: "responsibility", label: "Being Responsible" },
    { value: "courage", label: "Being Brave" },
    { value: "forgiveness", label: "Power of Forgiveness" },
    { value: "inclusion", label: "Including Everyone" },
    { value: "environmental", label: "Earth's Guardian" },
    { value: "persistence", label: "Keep Trying" },
    { value: "gratitude", label: "Being Thankful" },
    { value: "curiosity", label: "Love of Learning" },
    { value: "fairness", label: "Playing Fair" }
  ],
  tween: [
    { value: "integrity", label: "Standing Up for Right" },
    { value: "leadership", label: "Leading by Example" },
    { value: "perseverance", label: "Never Give Up" },
    { value: "empathy", label: "Walking in Others' Shoes" },
    { value: "self-confidence", label: "Believing in Yourself" },
    { value: "critical-thinking", label: "Think Before Acting" },
    { value: "goal-setting", label: "Achieving Goals" },
    { value: "digital-citizenship", label: "Online Responsibility" },
    { value: "authenticity", label: "Being True to Yourself" },
    { value: "adaptability", label: "Embracing Change" },
    { value: "determination", label: "Overcoming Obstacles" },
    { value: "innovation", label: "Creative Solutions" }
  ],
  teen: [
    { value: "self-discovery", label: "Finding Your Path" },
    { value: "social-justice", label: "Standing for Justice" },
    { value: "mental-health", label: "Mental Wellness" },
    { value: "relationships", label: "Healthy Relationships" },
    { value: "identity", label: "Embracing Identity" },
    { value: "global-awareness", label: "Global Citizen" },
    { value: "civic-duty", label: "Community Action" },
    { value: "resilience", label: "Bouncing Back" },
    { value: "independence", label: "Finding Independence" },
    { value: "diversity", label: "Celebrating Differences" },
    { value: "communication", label: "Open Communication" },
    { value: "balance", label: "Life Balance" }
  ],
  adult: [
    { value: "ethical-choices", label: "Ethical Dilemmas" },
    { value: "cultural-understanding", label: "Cultural Bridges" },
    { value: "mortality", label: "Legacy & Purpose" },
    { value: "power", label: "Power & Responsibility" },
    { value: "truth", label: "Truth & Perspective" },
    { value: "societal-change", label: "Agents of Change" },
    { value: "human-nature", label: "Human Nature" },
    { value: "existential", label: "Life's Big Questions" },
    { value: "redemption", label: "Path to Redemption" },
    { value: "wisdom", label: "Wisdom Through Experience" },
    { value: "compassion", label: "Universal Compassion" },
    { value: "growth", label: "Personal Evolution" }
  ],
};

export const KIDS_AGE_GROUPS = [
  { id: '5-7', label: '5-7 Years', icon: '🌟' },
  { id: '8-10', label: '8-10 Years', icon: '🌈' },
  { id: '11-12', label: '11-12 Years', icon: '⭐' },
];

export const KIDS_STORY_TYPES = {
  '5-7': [
    { id: 'animals', label: 'Animal Friends', icon: '🐾', description: 'Stories about friendly animals!' },
    { id: 'magic', label: 'Magic & Wonder', icon: '✨', description: 'Discover magical adventures!' },
    { id: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦', description: 'Stories about family time!' },
    { id: 'nature', label: 'Nature Tales', icon: '🌳', description: 'Explore the outdoors!' },
    { id: 'bedtime', label: 'Bedtime Stories', icon: '🌙', description: 'Perfect for sleepy time!' },
    { id: 'friendship', label: 'Best Friends', icon: '🤝', description: 'Stories about friendship!' },
  ],
  '8-10': [
    { id: 'adventure', label: 'Epic Adventures', icon: '🗺️', description: 'Go on exciting quests!' },
    { id: 'mystery', label: 'Mystery Stories', icon: '🔍', description: 'Solve fun mysteries!' },
    { id: 'science', label: 'Science Fun', icon: '🔬', description: 'Discover cool science!' },
    { id: 'sports', label: 'Sports Stories', icon: '⚽', description: 'Athletic adventures!' },
    { id: 'fantasy', label: 'Fantasy Worlds', icon: '🏰', description: 'Visit magical places!' },
    { id: 'school', label: 'School Days', icon: '📚', description: 'Fun school stories!' },
  ],
  '11-12': [
    { id: 'action', label: 'Action Heroes', icon: '🦸‍♂️', description: 'Be a hero!' },
    { id: 'space', label: 'Space Explorer', icon: '🚀', description: 'Journey to the stars!' },
    { id: 'detective', label: 'Detective Tales', icon: '🕵️‍♂️', description: 'Solve mysteries!' },
    { id: 'mythology', label: 'Myth & Legend', icon: '🐉', description: 'Ancient tales!' },
    { id: 'technology', label: 'Tech Adventures', icon: '🤖', description: 'Digital quests!' },
    { id: 'survival', label: 'Survival Stories', icon: '🏕️', description: 'Outdoor challenges!' },
  ],
} as const;
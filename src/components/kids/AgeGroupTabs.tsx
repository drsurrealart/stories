import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KIDS_AGE_GROUPS } from "@/data/storyOptions";

interface AgeGroupTabsProps {
  selectedAgeGroup: string;
  onAgeGroupChange: (value: string) => void;
}

export function AgeGroupTabs({ selectedAgeGroup, onAgeGroupChange }: AgeGroupTabsProps) {
  if (!selectedAgeGroup) return null;

  return (
    <div className="flex justify-center mb-6">
      <Tabs value={selectedAgeGroup} onValueChange={onAgeGroupChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 md:h-14">
          {KIDS_AGE_GROUPS.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:p-4 text-base md:text-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="text-2xl md:text-xl">{group.icon}</span>
              <span className="text-sm md:text-base">{group.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
import { BookOpen } from "lucide-react";

export function StoryCreatorHeader() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary">
        <BookOpen className="inline-block mr-2 mb-1" />
        Kids Story Creator
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground">
        Let's create an amazing story together!
      </p>
    </div>
  );
}
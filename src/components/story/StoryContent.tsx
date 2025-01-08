import { Card } from "@/components/ui/card";

interface StoryContentProps {
  title: string;
  content: string;
  moral: string;
}

export function StoryContent({ title, content, moral }: StoryContentProps) {
  return (
    <>
      <div className="prose max-w-none">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-story-text leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {content}
        </div>
      </div>

      {moral && (
        <Card className="bg-secondary p-4 md:p-6 mt-4">
          <h3 className="font-semibold text-lg mb-2">Moral</h3>
          <p className="text-story-text">{moral}</p>
        </Card>
      )}
    </>
  );
}
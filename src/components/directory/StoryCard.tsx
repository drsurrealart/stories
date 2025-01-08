import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Story = {
  id: string;
  title: string;
  content: string;
  age_group: string;
  genre: string;
  moral: string;
  created_at: string;
};

export function StoryCard({ story }: { story: Story }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{story.content}</p>
        <div className="mt-2 flex gap-2 text-xs">
          <span className="text-blue-600">Age: {story.age_group}</span>
          <span className="text-green-600">Genre: {story.genre}</span>
          <span className="text-purple-600">Moral: {story.moral}</span>
        </div>
      </CardContent>
    </Card>
  );
}
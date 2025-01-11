import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  firstName?: string | null;
}

export const WelcomeCard = ({ firstName }: WelcomeCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {firstName || "Storyteller"}!
          </h1>
          <p className="text-muted-foreground">
            Ready to create more amazing stories today?
          </p>
        </div>
      </div>
    </Card>
  );
};
import { Music, Headphones } from "lucide-react";

export const AudioHeader = () => {
  return (
    <div className="space-y-4 text-center max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-2">
        <Music className="h-8 w-8 text-primary animate-bounce" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
          My Audio Stories
        </h1>
        <Headphones className="h-8 w-8 text-primary animate-bounce" />
      </div>
      <p className="text-lg text-muted-foreground">
        Your collection of stories brought to life through the power of voice.
      </p>
    </div>
  );
};
import { NavigationBar } from "@/components/NavigationBar";

interface StoryCreatorLayoutProps {
  children: React.ReactNode;
}

export function StoryCreatorLayout({ children }: StoryCreatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
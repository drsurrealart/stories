import { HelpCircle } from "lucide-react";

export const SupportHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="p-3 bg-primary/10 rounded-full">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        Welcome to our support center. Find answers to common questions and learn how to make the most of our AI-powered story creation platform.
      </p>
    </div>
  );
};
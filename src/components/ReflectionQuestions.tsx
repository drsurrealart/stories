import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BookOpen, Send } from "lucide-react";

interface ReflectionQuestionsProps {
  questions: string[];
  onComplete: () => void;
}

export function ReflectionQuestions({ questions, onComplete }: ReflectionQuestionsProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""));

  const handleSubmit = () => {
    // In a real app, we might want to save these answers
    console.log("Reflection answers:", answers);
    onComplete();
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Reflect on the Story</h2>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <label className="text-sm font-medium">{question}</label>
            <Textarea
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder="Write your thoughts here..."
              className="min-h-[100px]"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Submit Reflection
      </Button>
    </Card>
  );
}
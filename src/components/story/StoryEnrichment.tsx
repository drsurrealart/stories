import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { BookOpen, Footprints, Quote, Users } from "lucide-react";

interface StoryEnrichmentProps {
  moral: string;
}

export function StoryEnrichment({ moral }: StoryEnrichmentProps) {
  // Generate reflection questions based on the moral
  const reflectionQuestions = [
    `How does the story's message about ${moral.toLowerCase()} relate to your own life?`,
    `What challenges did the characters face in learning about ${moral.toLowerCase()}?`,
    `How can you apply the lesson of ${moral.toLowerCase()} in your daily life?`,
  ];

  // Generate action steps based on the moral
  const actionSteps = [
    `Practice ${moral.toLowerCase()} in your daily interactions`,
    `Keep a journal about moments when you observe ${moral.toLowerCase()}`,
    `Share this story and its lesson about ${moral.toLowerCase()} with others`,
  ];

  // Generate a relevant quote based on the moral
  const relatedQuote = `"The true measure of character is how we handle ${moral.toLowerCase()} in our everyday lives."`;

  // Generate discussion prompts
  const discussionPrompts = [
    `Share a time when you experienced a situation similar to the story`,
    `How would you have handled the situation differently?`,
    `What other stories or examples remind you of this moral?`,
  ];

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="reflection" className="border-none">
        <Card className="bg-[#E5DEFF] hover:bg-[#D3CCFF] transition-colors">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Reflection Questions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-3">
              {reflectionQuestions.map((question, index) => (
                <li key={index} className="text-sm">
                  {index + 1}. {question}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="actions" className="border-none">
        <Card className="bg-[#FDE1D3] hover:bg-[#FBD1BE] transition-colors">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <Footprints className="w-5 h-5" />
              <span className="font-semibold">Action Steps</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-3">
              {actionSteps.map((step, index) => (
                <li key={index} className="text-sm">
                  {index + 1}. {step}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="quotes" className="border-none">
        <Card className="bg-[#F2FCE2] hover:bg-[#E5F5CC] transition-colors">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <Quote className="w-5 h-5" />
              <span className="font-semibold">Related Quote</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm italic">{relatedQuote}</p>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="discussion" className="border-none">
        <Card className="bg-[#D3E4FD] hover:bg-[#BED5F9] transition-colors">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Discussion Prompts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-3">
              {discussionPrompts.map((prompt, index) => (
                <li key={index} className="text-sm">
                  {index + 1}. {prompt}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
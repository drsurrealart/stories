import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { BookOpen, Footprints } from "lucide-react";

interface StoryEnrichmentProps {
  reflectionQuestions: string[];
  actionSteps: string[];
  relatedQuote?: string;
  discussionPrompts?: string[];
}

export function StoryEnrichment({ 
  reflectionQuestions,
  actionSteps
}: StoryEnrichmentProps) {
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
    </Accordion>
  );
}
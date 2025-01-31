import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Wand2, CreditCard, Settings, Image, FileText, Headphones, Share2 } from "lucide-react";

export const FAQSection = () => {
  const faqCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      items: [
        {
          question: "What is LearnMorals.com?",
          answer: "LearnMorals.com is an AI-powered platform that creates personalized stories with meaningful moral lessons. Our system generates unique stories tailored to different age groups, reading levels, and moral themes, complete with illustrations, audio narration, and interactive elements."
        },
        {
          question: "How do I create my first story?",
          answer: "Creating your first story is easy: 1) Click 'Create Story' in the navigation bar, 2) Choose your preferred age group and moral theme, 3) Customize settings like length and tone, 4) Click 'Generate Story' to create your personalized story."
        },
        {
          question: "What age groups are supported?",
          answer: "We support multiple age groups: Early Readers (3-6), Young Readers (7-9), Pre-teens (10-12), and Teens (13+). Each age group receives appropriately tailored content and complexity."
        }
      ]
    },
    {
      icon: Wand2,
      title: "Story Creation",
      items: [
        {
          question: "Can I customize story settings?",
          answer: "Yes! You can customize story length (short, medium, long), reading level, language style, tone, genre preferences, and specific moral themes. Each option helps create a more personalized story experience."
        },
        {
          question: "What types of moral lessons are available?",
          answer: "We offer a wide range of moral lessons including kindness, honesty, responsibility, perseverance, respect, environmental awareness, and many more. Each story is crafted to teach these values in an engaging way."
        },
        {
          question: "How long does it take to generate a story?",
          answer: "Most stories are generated within 1-2 minutes. The exact time may vary based on the story length, complexity, and whether you're including additional features like illustrations or audio."
        }
      ]
    },
    {
      icon: Image,
      title: "Story Features",
      items: [
        {
          question: "What multimedia features are available?",
          answer: "Stories can include AI-generated illustrations, audio narration, PDF downloads, and interactive elements like reflection questions and discussion prompts."
        },
        {
          question: "How do story illustrations work?",
          answer: "Our AI generates custom illustrations based on your story's content. You can choose different art styles and generate multiple variations until you find the perfect match."
        },
        {
          question: "Can I translate stories to other languages?",
          answer: "Yes, stories can be translated into multiple languages while preserving the moral lessons and emotional impact of the original content."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Subscriptions & Credits",
      items: [
        {
          question: "How do credits work?",
          answer: "Credits are used to generate new stories and features. Each subscription tier comes with a monthly credit allowance. Different features cost different amounts of credits: Story Generation (1), Illustrations (5), Audio (3), and PDF (1)."
        },
        {
          question: "What happens if I run out of credits?",
          answer: "You can purchase additional credits or wait for your monthly renewal. Previously generated stories remain accessible even without available credits."
        },
        {
          question: "Can I upgrade my subscription?",
          answer: "Yes, you can upgrade your subscription at any time. When you upgrade, you'll immediately receive the new tier's benefits and additional monthly credits."
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {faqCategories.map((category, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <category.icon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{category.title}</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {category.items.map((item, itemIndex) => (
              <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};
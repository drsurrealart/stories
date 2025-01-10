import { Json } from "@/integrations/supabase/types";

export interface SavedStory {
  id: string;
  title: string;
  content: string;
  moral: string;
  created_at: string;
  reflection_questions: Json;
  action_steps: Json;
  related_quote: string | null;
  discussion_prompts: Json;
  age_group: string;
  genre: string;
  language: string;
  tone: string;
  reading_level: string;
  length_preference: string;
}
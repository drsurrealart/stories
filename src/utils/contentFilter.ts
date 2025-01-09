import { supabase } from "@/integrations/supabase/client";

export async function loadContentFilters() {
  const { data: filters } = await supabase
    .from('content_filters')
    .select('word');
  return filters?.map(f => f.word.toLowerCase()) || [];
}

export function containsInappropriateContent(text: string, bannedWords: string[]): boolean {
  const normalizedText = text.toLowerCase();
  return bannedWords.some(word => normalizedText.includes(word.toLowerCase()));
}
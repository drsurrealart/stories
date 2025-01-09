import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { loadContentFilters, containsInappropriateContent } from "@/utils/contentFilter";
import { useToast } from "@/hooks/use-toast";

interface CharacterNameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CharacterNameInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter a character name"
}: CharacterNameInputProps) {
  const [bannedWords, setBannedWords] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadContentFilters().then(setBannedWords);
  }, []);

  const handleChange = async (newValue: string) => {
    if (newValue && newValue.length > 20) {
      toast({
        title: "Name too long",
        description: "Character names must be 20 characters or less",
        variant: "destructive",
      });
      return;
    }

    if (bannedWords.length > 0 && containsInappropriateContent(newValue, bannedWords)) {
      toast({
        title: "Inappropriate content",
        description: "Please use appropriate language for character names",
        variant: "destructive",
      });
      return;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={20}
      />
    </div>
  );
}
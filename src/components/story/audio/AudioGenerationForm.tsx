import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VoiceSelector } from "./VoiceSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AudioGenerationFormProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  isGenerating: boolean;
  showConfirmDialog: boolean;
  onConfirmDialogChange: (show: boolean) => void;
  onGenerate: () => void;
  creditCost?: number;
}

export function AudioGenerationForm({
  selectedVoice,
  onVoiceChange,
  isGenerating,
  showConfirmDialog,
  onConfirmDialogChange,
  onGenerate,
}: AudioGenerationFormProps) {
  const { data: audioCreditCost } = useQuery({
    queryKey: ['audio-credits-cost'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('audio_credits_cost')
        .eq('key_name', 'AUDIO_STORY_CREDITS')
        .single();

      if (error) throw error;
      return data?.audio_credits_cost || 3; // Default to 3 if not set
    },
  });

  return (
    <div className="space-y-4">
      <VoiceSelector
        selectedVoice={selectedVoice}
        onVoiceChange={onVoiceChange}
      />

      <Button 
        className="w-full" 
        onClick={() => onConfirmDialogChange(true)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Audio...
          </>
        ) : (
          `Create Audio Story (Uses ${audioCreditCost} Credits)`
        )}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={onConfirmDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Audio Story</AlertDialogTitle>
            <AlertDialogDescription>
              This will use {audioCreditCost} AI credits to generate an audio version of your story. 
              Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onGenerate}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSelect } from "@/components/story/LanguageSelect";
import { useNavigate } from "react-router-dom";
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

interface StoryTranslationProps {
  storyId: string;
  onTranslationComplete?: () => void;
}

export function StoryTranslation({ storyId, onTranslationComplete }: StoryTranslationProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("spanish");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to translate stories.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('translate-story', {
        body: { 
          storyId,
          targetLanguage,
          userId: session.user.id
        }
      });

      if (response.error) throw response.error;

      // Get the translated story ID from the response
      const translatedStoryId = response.data?.translatedStoryId;

      toast({
        title: "Success",
        description: "Story translated successfully!",
      });

      if (onTranslationComplete) {
        onTranslationComplete();
      }

      // Redirect to the My Stories page with the translated story highlighted
      navigate(`/your-stories?story=${translatedStoryId}`);

    } catch (error: any) {
      console.error('Error translating story:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to translate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Card className="p-4 md:p-6 space-y-4 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Translate Story</h3>
        </div>

        <div className="space-y-4">
          <LanguageSelect
            value={targetLanguage}
            onChange={setTargetLanguage}
          />

          <Button
            onClick={() => setShowConfirmDialog(true)}
            disabled={isTranslating}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>Translate Story (Uses 1 Credit)</>
            )}
          </Button>
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Translation</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new translated version of your story in {targetLanguage}.
              This action will use 1 credit from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTranslate}>
              Confirm Translation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
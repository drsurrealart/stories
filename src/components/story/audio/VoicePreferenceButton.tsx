import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface VoicePreferenceButtonProps {
  voiceId: string;
}

export function VoicePreferenceButton({ voiceId }: VoicePreferenceButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch user profiles
  const { data: userProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: profiles } = await supabase
        .from('user_sub_profiles')
        .select('*')
        .eq('user_id', session.user.id);

      return profiles || [];
    }
  });

  // Fetch existing preferences
  const { data: preferences, refetch: refetchPreferences } = useQuery({
    queryKey: ['voice-preferences', voiceId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from('voice_preferences')
        .select('*')
        .eq('user_id', session.user.id);

      return data || [];
    }
  });

  const setPreference = async (profileId: string | null) => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to set voice preferences",
          variant: "destructive",
        });
        return;
      }

      // Check if preference already exists
      const existingPreference = preferences?.find(p => p.profile_id === profileId);

      if (existingPreference) {
        // Update existing preference
        const { error } = await supabase
          .from('voice_preferences')
          .update({ voice_id: voiceId })
          .eq('id', existingPreference.id);

        if (error) throw error;
      } else {
        // Create new preference
        const { error } = await supabase
          .from('voice_preferences')
          .insert({
            user_id: session.user.id,
            profile_id: profileId,
            voice_id: voiceId,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Voice preference saved successfully",
      });

      refetchPreferences();
    } catch (error: any) {
      console.error('Error setting voice preference:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save voice preference",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPreferred = (profileId: string | null) => {
    return preferences?.some(p => 
      p.profile_id === profileId && p.voice_id === voiceId
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          disabled={isSubmitting}
          className={isPreferred(null) ? "text-yellow-500" : ""}
        >
          <Star className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Set as Default For</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setPreference("personal")}>
          Personal (Adult)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPreference("kids")}>
          Kids Mode
        </DropdownMenuItem>
        {userProfiles?.map((profile) => (
          <DropdownMenuItem 
            key={profile.id} 
            onClick={() => setPreference(profile.id)}
          >
            {profile.name} ({profile.type})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
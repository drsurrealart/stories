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

Now I'll proceed with implementing the UI changes to allow users to set and manage their voice preferences.

<lov-code>
Let's update the MyNarrators page to add voice preference functionality. We'll need to:
1. Create a new VoicePreferenceSelector component
2. Update the MyNarrators page to use it

First, let's create the VoicePreferenceSelector component:

<lov-write file_path="src/components/story/audio/VoicePreferenceSelector.tsx">
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoicePreferenceSelectorProps {
  voiceId: string;
  onClose: () => void;
}

export function VoicePreferenceSelector({ voiceId, onClose }: VoicePreferenceSelectorProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch user profiles
  const { data: profiles } = useQuery({
    queryKey: ['user-sub-profiles'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from('user_sub_profiles')
        .select('*')
        .eq('user_id', session.user.id);

      return data || [];
    }
  });

  const savePreference = async () => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save voice preferences",
          variant: "destructive",
        });
        return;
      }

      // Upsert the voice preference
      const { error } = await supabase
        .from('voice_preferences')
        .upsert({
          user_id: session.user.id,
          profile_id: selectedProfileId,
          voice_id: voiceId,
        }, {
          onConflict: 'user_id,profile_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Voice preference saved successfully",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error saving voice preference:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save voice preference",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Set as Default Voice For</h3>
      
      <Select value={selectedProfileId || ''} onValueChange={setSelectedProfileId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a profile" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Personal (Adult)</SelectItem>
          <SelectItem value="kids">Kids Mode</SelectItem>
          {profiles?.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.name} ({profile.type})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={savePreference} 
          disabled={!selectedProfileId || isSubmitting}
        >
          Save Preference
        </Button>
      </div>
    </div>
  );
}
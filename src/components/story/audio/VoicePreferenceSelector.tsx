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
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type WatermarkSetting = Database['public']['Tables']['watermark_settings']['Row'];

const contentTypes = [
  { id: 'text_story', label: 'Text Story' },
  { id: 'audio_story', label: 'Story Audio' },
  { id: 'story_image', label: 'Story Image' },
  { id: 'story_video', label: 'Story Video' },
  { id: 'story_pdf', label: 'Story PDF' },
] as const;

const subscriptionLevels = [
  { id: 'free', label: 'Free' },
  { id: 'basic', label: 'Basic' },
  { id: 'premium', label: 'Premium' },
] as const;

export const WatermarkSettings = ({ settings = [] }: { settings: WatermarkSetting[] }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (contentType: WatermarkSetting['content_type'], subscriptionLevel: WatermarkSetting['subscription_level'], currentValue: boolean) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('watermark_settings')
        .upsert([{
          content_type: contentType,
          subscription_level: subscriptionLevel,
          is_active: !currentValue,
        }], {
          onConflict: 'content_type,subscription_level'
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['watermark-settings'] });
      
      toast({
        title: "Success",
        description: "Watermark setting updated successfully",
      });
    } catch (error) {
      console.error('Error updating watermark setting:', error);
      toast({
        title: "Error",
        description: "Failed to update watermark setting",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const isEnabled = (contentType: WatermarkSetting['content_type'], subscriptionLevel: WatermarkSetting['subscription_level']) => {
    const setting = settings.find(
      s => s.content_type === contentType && s.subscription_level === subscriptionLevel
    );
    return setting?.is_active ?? false;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Type</TableHead>
              {subscriptionLevels.map((level) => (
                <TableHead key={level.id}>{level.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.label}</TableCell>
                {subscriptionLevels.map((level) => (
                  <TableCell key={`${type.id}-${level.id}`}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${type.id}-${level.id}`}
                        checked={isEnabled(type.id, level.id)}
                        onCheckedChange={() => 
                          handleToggle(type.id, level.id, isEnabled(type.id, level.id))
                        }
                        disabled={updating}
                      />
                      <Label htmlFor={`${type.id}-${level.id}`}>
                        {isEnabled(type.id, level.id) ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
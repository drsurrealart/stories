
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
import { FeatureSetting, FEATURE_LABELS, SubscriptionLevel } from "./types";

const subscriptionLevels: { id: SubscriptionLevel; label: string }[] = [
  { id: 'free', label: 'Free' },
  { id: 'basic', label: 'Basic' },
  { id: 'premium', label: 'Premium' },
];

export const FeatureSettings = ({ settings = [] }: { settings: FeatureSetting[] }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (featureType: FeatureSetting['feature_type'], subscriptionLevel: SubscriptionLevel, currentValue: boolean) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('feature_settings')
        .update({ is_active: !currentValue })
        .eq('feature_type', featureType)
        .eq('subscription_level', subscriptionLevel);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['feature-settings'] });
      
      toast({
        title: "Success",
        description: "Feature setting updated successfully",
      });
    } catch (error) {
      console.error('Error updating feature setting:', error);
      toast({
        title: "Error",
        description: "Failed to update feature setting",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const isEnabled = (featureType: FeatureSetting['feature_type'], subscriptionLevel: SubscriptionLevel) => {
    const setting = settings.find(
      s => s.feature_type === featureType && s.subscription_level === subscriptionLevel
    );
    return setting?.is_active ?? false;
  };

  const featureTypes = Object.keys(FEATURE_LABELS) as Array<keyof typeof FEATURE_LABELS>;

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {subscriptionLevels.map((level) => (
                <TableHead key={level.id}>{level.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {featureTypes.map((type) => (
              <TableRow key={type}>
                <TableCell>{FEATURE_LABELS[type]}</TableCell>
                {subscriptionLevels.map((level) => (
                  <TableCell key={`${type}-${level.id}`}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${type}-${level.id}`}
                        checked={isEnabled(type, level.id)}
                        onCheckedChange={() => 
                          handleToggle(type, level.id, isEnabled(type, level.id))
                        }
                        disabled={updating}
                      />
                      <Label htmlFor={`${type}-${level.id}`}>
                        {isEnabled(type, level.id) ? 'Active' : 'Inactive'}
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

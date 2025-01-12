import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { TierTableRow } from "./subscription/TierTableRow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const SubscriptionTierManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [audioCreditCost, setAudioCreditCost] = useState<number>(3);
  const [imageCreditCost, setImageCreditCost] = useState<number>(5);
  const [isUpdatingAudioCredits, setIsUpdatingAudioCredits] = useState(false);
  const [isUpdatingImageCredits, setIsUpdatingImageCredits] = useState(false);

  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['admin-subscription-tiers'],
    queryFn: async () => {
      console.log("Fetching subscription tiers...");
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price');
      
      if (error) {
        console.error("Error fetching tiers:", error);
        throw error;
      }
      console.log("Fetched tiers:", data);
      return data;
    },
  });

  const { data: audioConfig, isLoading: configLoading } = useQuery({
    queryKey: ['audio-credits-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('key_name', 'AUDIO_STORY_CREDITS')
        .single();

      if (error) throw error;
      
      setAudioCreditCost(data.audio_credits_cost);
      setImageCreditCost(data.image_credits_cost);
      return data;
    },
  });

  const handleSave = async (
    tierId: string,
    formData: {
      monthly_credits: number;
      saved_stories_limit: number;
      price: number;
      yearly_price: number;
    }
  ) => {
    try {
      console.log("Saving tier:", tierId, formData);
      const { data, error } = await supabase
        .from('subscription_tiers')
        .update({
          monthly_credits: formData.monthly_credits,
          saved_stories_limit: formData.saved_stories_limit,
          price: formData.price,
          yearly_price: formData.yearly_price,
        })
        .eq('id', tierId)
        .select();

      if (error) {
        console.error("Error updating tier:", error);
        throw error;
      }

      console.log("Update response:", data);

      await queryClient.invalidateQueries({ queryKey: ['admin-subscription-tiers'] });

      toast({
        title: "Success",
        description: "Subscription tier updated successfully",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription tier",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAudioCredits = async () => {
    setIsUpdatingAudioCredits(true);
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({ audio_credits_cost: audioCreditCost })
        .eq('key_name', 'AUDIO_STORY_CREDITS');

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['audio-credits-config'] });

      toast({
        title: "Success",
        description: "Audio credits cost updated successfully",
      });
    } catch (error) {
      console.error("Error updating audio credits cost:", error);
      toast({
        title: "Error",
        description: "Failed to update audio credits cost",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAudioCredits(false);
    }
  };

  const handleUpdateImageCredits = async () => {
    setIsUpdatingImageCredits(true);
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({ image_credits_cost: imageCreditCost })
        .eq('key_name', 'AUDIO_STORY_CREDITS');

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['audio-credits-config'] });

      toast({
        title: "Success",
        description: "Image credits cost updated successfully",
      });
    } catch (error) {
      console.error("Error updating image credits cost:", error);
      toast({
        title: "Error",
        description: "Failed to update image credits cost",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingImageCredits(false);
    }
  };

  if (tiersLoading || configLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Subscription Tiers</h2>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audio Story Settings</h3>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="audioCreditCost">Credits Required per Audio Story</Label>
              <Input
                id="audioCreditCost"
                type="number"
                value={audioCreditCost}
                onChange={(e) => setAudioCreditCost(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Button 
              onClick={handleUpdateAudioCredits}
              disabled={isUpdatingAudioCredits}
            >
              {isUpdatingAudioCredits ? "Updating..." : "Update Credits"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Story Image Settings</h3>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageCreditCost">Credits Required per Story Image</Label>
              <Input
                id="imageCreditCost"
                type="number"
                value={imageCreditCost}
                onChange={(e) => setImageCreditCost(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Button 
              onClick={handleUpdateImageCredits}
              disabled={isUpdatingImageCredits}
            >
              {isUpdatingImageCredits ? "Updating..." : "Update Credits"}
            </Button>
          </div>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers?.map((tier) => (
            <TierTableRow
              key={tier.id}
              tier={tier}
              isEditing={editingId === tier.id}
              onEdit={() => setEditingId(tier.id)}
              onSave={(formData) => handleSave(tier.id, formData)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
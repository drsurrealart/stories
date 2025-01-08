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

export const SubscriptionTierManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: tiers, isLoading } = useQuery({
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

  const handleSave = async (
    tierId: string,
    formData: {
      stories_per_month: number;
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
          stories_per_month: formData.stories_per_month,
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

      // Invalidate and refetch
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Subscription Tiers</h2>
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
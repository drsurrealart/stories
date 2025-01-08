import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionTierManager = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    stories_per_month: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  }>({
    stories_per_month: 0,
    saved_stories_limit: 0,
    price: 0,
    yearly_price: 0,
  });

  const { data: tiers, isLoading, refetch } = useQuery({
    queryKey: ['admin-subscription-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (tier: any) => {
    setEditingId(tier.id);
    setEditForm({
      stories_per_month: tier.stories_per_month,
      saved_stories_limit: tier.saved_stories_limit,
      price: tier.price,
      yearly_price: tier.yearly_price,
    });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('subscription_tiers')
        .update({
          stories_per_month: editForm.stories_per_month,
          saved_stories_limit: editForm.saved_stories_limit,
          price: editForm.price,
          yearly_price: editForm.yearly_price,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription tier updated successfully",
      });

      setEditingId(null);
      refetch();
    } catch (error) {
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
            <TableHead>Stories/Month</TableHead>
            <TableHead>Saved Stories</TableHead>
            <TableHead>Monthly Price</TableHead>
            <TableHead>Yearly Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers?.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">{tier.name}</TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    value={editForm.stories_per_month}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        stories_per_month: parseInt(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                ) : (
                  tier.stories_per_month
                )}
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    value={editForm.saved_stories_limit}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        saved_stories_limit: parseInt(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                ) : (
                  tier.saved_stories_limit
                )}
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                ) : (
                  `$${tier.price}`
                )}
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    value={editForm.yearly_price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        yearly_price: parseFloat(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                ) : (
                  `$${tier.yearly_price}`
                )}
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <div className="space-x-2">
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => handleEdit(tier)} size="sm">
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
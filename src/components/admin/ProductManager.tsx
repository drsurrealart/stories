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
import { ProductTableRow } from "./products/ProductTableRow";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: 'credits';
}

export const ProductManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'credits')
        .single();
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Fetched product:", data);
      return data as Product;
    },
  });

  const handleSave = async (
    productId: string,
    formData: {
      price: number;
    }
  ) => {
    try {
      console.log("Saving product:", productId, formData);
      const { data, error } = await supabase
        .from('products')
        .update({
          price: formData.price,
        })
        .eq('id', productId)
        .select();

      if (error) {
        console.error("Error updating product:", error);
        throw error;
      }

      console.log("Update response:", data);

      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });

      toast({
        title: "Success",
        description: "Credit price updated successfully",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: "Failed to update credit price",
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

  if (!products) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Credits</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ProductTableRow
            key={products.id}
            product={products}
            isEditing={editingId === products.id}
            onEdit={() => setEditingId(products.id)}
            onSave={(formData) => handleSave(products.id, formData)}
            onCancel={() => setEditingId(null)}
          />
        </TableBody>
      </Table>
    </div>
  );
};
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
        .order('price');
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Fetched products:", data);
      return data;
    },
  });

  const handleSave = async (
    productId: string,
    formData: {
      name: string;
      description: string | null;
      price: number;
      type: 'credits' | 'lifetime';
    }
  ) => {
    try {
      console.log("Saving product:", productId, formData);
      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          type: formData.type,
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
        description: "Product updated successfully",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
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
      <h2 className="text-2xl font-bold">Manage Products</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              isEditing={editingId === product.id}
              onEdit={() => setEditingId(product.id)}
              onSave={(formData) => handleSave(product.id, formData)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
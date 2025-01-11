import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: 'credits' | 'lifetime';
}

interface ProductTableRowProps {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (formData: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const ProductTableRow = ({
  product,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: ProductTableRowProps) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
  });

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <div className="space-y-2">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product name"
            />
            <Textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              placeholder="Price"
            />
            <Select
              value={formData.type}
              onValueChange={(value: 'credits' | 'lifetime') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-x-2">
              <Button onClick={() => onSave(formData)} size="sm">
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">{product.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>${product.price}</div>
          <div className="text-sm text-gray-500">Type: {product.type}</div>
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
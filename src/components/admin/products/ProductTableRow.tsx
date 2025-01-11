import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: 'credits';
}

interface ProductTableRowProps {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (formData: { price: number }) => void;
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
    price: product.price,
  });

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">{product.description}</div>
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
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit Price
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
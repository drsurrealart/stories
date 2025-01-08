import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditTierFormProps {
  tier: {
    stories_per_month: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  };
  onSave: (formData: {
    stories_per_month: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  }) => void;
  onCancel: () => void;
}

export const EditTierForm = ({ tier, onSave, onCancel }: EditTierFormProps) => {
  const [formData, setFormData] = useState({
    stories_per_month: tier.stories_per_month,
    saved_stories_limit: tier.saved_stories_limit,
    price: tier.price,
    yearly_price: tier.yearly_price,
  });

  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={formData.stories_per_month}
        onChange={(e) =>
          setFormData({
            ...formData,
            stories_per_month: parseInt(e.target.value),
          })
        }
        className="w-24"
      />
      <Input
        type="number"
        value={formData.saved_stories_limit}
        onChange={(e) =>
          setFormData({
            ...formData,
            saved_stories_limit: parseInt(e.target.value),
          })
        }
        className="w-24"
      />
      <Input
        type="number"
        value={formData.price}
        onChange={(e) =>
          setFormData({
            ...formData,
            price: parseFloat(e.target.value),
          })
        }
        className="w-24"
      />
      <Input
        type="number"
        value={formData.yearly_price}
        onChange={(e) =>
          setFormData({
            ...formData,
            yearly_price: parseFloat(e.target.value),
          })
        }
        className="w-24"
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
  );
};
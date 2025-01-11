import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EditTierFormProps {
  tier: {
    level: string;
    monthly_credits: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  };
  onSave: (formData: {
    monthly_credits: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  }) => void;
  onCancel: () => void;
}

export const EditTierForm = ({ tier, onSave, onCancel }: EditTierFormProps) => {
  const [formData, setFormData] = useState({
    monthly_credits: tier.monthly_credits,
    saved_stories_limit: tier.saved_stories_limit,
    price: tier.price,
    yearly_price: tier.yearly_price,
  });

  const isOneTimePayment = ['lifetime', 'credits'].includes(tier.level);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthly_credits">AI Credits</Label>
        <Input
          id="monthly_credits"
          type="number"
          value={formData.monthly_credits}
          onChange={(e) =>
            setFormData({
              ...formData,
              monthly_credits: parseInt(e.target.value),
            })
          }
          className="w-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="saved_stories_limit">Saved Stories Limit</Label>
        <Input
          id="saved_stories_limit"
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">
          {isOneTimePayment ? 'One Time Price ($)' : 'Monthly Price ($)'}
        </Label>
        <Input
          id="price"
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
      </div>

      {!isOneTimePayment && (
        <div className="space-y-2">
          <Label htmlFor="yearly_price">Yearly Price ($)</Label>
          <Input
            id="yearly_price"
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
        </div>
      )}

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
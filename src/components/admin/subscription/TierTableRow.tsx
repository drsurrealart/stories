import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditTierForm } from "./EditTierForm";

interface TierTableRowProps {
  tier: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (formData: {
    stories_per_month: number;
    saved_stories_limit: number;
    price: number;
    yearly_price: number;
  }) => void;
  onCancel: () => void;
}

export const TierTableRow = ({
  tier,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: TierTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{tier.name}</TableCell>
      <TableCell>
        {isEditing ? (
          <EditTierForm tier={tier} onSave={onSave} onCancel={onCancel} />
        ) : (
          <>
            <div>Stories/Month: {tier.stories_per_month}</div>
            <div>Saved Stories: {tier.saved_stories_limit}</div>
            <div>Monthly Price: ${tier.price}</div>
            <div>Yearly Price: ${tier.yearly_price}</div>
            <Button onClick={onEdit} size="sm" className="mt-2">
              Edit
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};
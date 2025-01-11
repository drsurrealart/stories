import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditTierForm } from "./EditTierForm";

interface TierTableRowProps {
  tier: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (formData: {
    monthly_credits: number;
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
  const isOneTimePayment = ['lifetime', 'credits'].includes(tier.level);

  return (
    <TableRow>
      <TableCell className="font-medium">{tier.name}</TableCell>
      <TableCell>
        {isEditing ? (
          <EditTierForm tier={tier} onSave={onSave} onCancel={onCancel} />
        ) : (
          <>
            <div>AI Credits: {tier.monthly_credits}</div>
            <div>Saved Stories: {tier.saved_stories_limit}</div>
            {isOneTimePayment ? (
              <div>One Time Price: ${tier.price}</div>
            ) : (
              <>
                <div>Monthly Price: ${tier.price}</div>
                <div>Yearly Price: ${tier.yearly_price}</div>
              </>
            )}
            <Button onClick={onEdit} size="sm" className="mt-2">
              Edit
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  totalCredits: number;
}

export function ConfirmationDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  totalCredits 
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Ready to Create Your Story?</AlertDialogTitle>
          <AlertDialogDescription className="text-lg space-y-4">
            <p>Make sure you have your parent's permission! 🌟</p>
            <p>This will use {totalCredits} credits to create:</p>
            <ul className="list-disc pl-6">
              <li>Your story (1 credit)</li>
              <li>An audio version to listen to (3 credits)</li>
              <li>A special picture for your story (5 credits)</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-lg">Not Yet</AlertDialogCancel>
          <AlertDialogAction 
            className="text-lg"
            onClick={onConfirm}
          >
            Yes, Create My Story!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FavoriteButton } from "@/components/story/FavoriteButton";
import { formatDate } from "@/utils/date";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StoryHeaderProps {
  title: string;
  createdAt: string;
  storyId: string;
  onDelete: (id: string) => void;
}

export function StoryHeader({ title, createdAt, storyId, onDelete }: StoryHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Saved on {formatDate(createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FavoriteButton storyId={storyId} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Story</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this story? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(storyId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
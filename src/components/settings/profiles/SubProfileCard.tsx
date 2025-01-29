import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubProfile {
  id: string;
  name: string;
  age: number;
  type: 'family' | 'student';
  gender: string | null;
  interests: string[] | null;
  ethnicity: string | null;
  hair_color: string | null;
}

interface SubProfileCardProps {
  profile: SubProfile;
  onEdit: (profile: SubProfile) => void;
  onDelete: (id: string) => void;
}

export const SubProfileCard = ({ profile, onEdit, onDelete }: SubProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>
          {profile.type === 'family' ? 'Family Member' : 'Student'} • Age: {profile.age}
          {profile.gender && ` • ${profile.gender}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {profile.ethnicity && (
            <div>
              <strong>Ethnicity:</strong> {profile.ethnicity}
            </div>
          )}
          {profile.hair_color && (
            <div>
              <strong>Hair Color:</strong> {profile.hair_color}
            </div>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <strong>Interests:</strong> {profile.interests.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(profile)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(profile.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

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

interface SubProfileFormProps {
  editingProfile: SubProfile | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const AVAILABLE_INTERESTS = [
  "Reading", "Sports", "Music", "Art", "Science",
  "Math", "Languages", "History", "Technology", "Nature"
];

const HAIR_COLORS = [
  "Black", "Brown", "Blonde", "Red", "Gray", "White", "Other"
];

const ETHNICITIES = [
  "Asian", "Black", "Hispanic", "Middle Eastern",
  "Native American", "Pacific Islander", "White", "Mixed", "Other"
];

export const SubProfileForm = ({ editingProfile, onCancel, onSuccess }: SubProfileFormProps) => {
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: "",
    type: "family" as "family" | "student",
    gender: "",
    interests: [] as string[],
    ethnicity: "",
    hair_color: "",
    customInterest: ""
  });
  const { toast } = useToast();

  // Load profile data when editing
  useEffect(() => {
    if (editingProfile) {
      setNewProfile({
        name: editingProfile.name,
        age: editingProfile.age.toString(),
        type: editingProfile.type,
        gender: editingProfile.gender || "",
        interests: editingProfile.interests || [],
        ethnicity: editingProfile.ethnicity || "",
        hair_color: editingProfile.hair_color || "",
        customInterest: ""
      });
    }
  }, [editingProfile]);

  const handleInterestToggle = (interest: string) => {
    setNewProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddCustomInterest = () => {
    if (newProfile.customInterest.trim()) {
      setNewProfile(prev => ({
        ...prev,
        interests: [...prev.interests, prev.customInterest.trim()],
        customInterest: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newProfile.name || !newProfile.age || !newProfile.gender || !newProfile.ethnicity || !newProfile.hair_color) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (editingProfile) {
        const { error } = await supabase
          .from("user_sub_profiles")
          .update({
            name: newProfile.name,
            age: parseInt(newProfile.age),
            type: newProfile.type,
            gender: newProfile.gender,
            interests: newProfile.interests,
            ethnicity: newProfile.ethnicity,
            hair_color: newProfile.hair_color,
          })
          .eq("id", editingProfile.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_sub_profiles")
          .insert({
            name: newProfile.name,
            age: parseInt(newProfile.age),
            type: newProfile.type,
            gender: newProfile.gender,
            interests: newProfile.interests,
            ethnicity: newProfile.ethnicity,
            hair_color: newProfile.hair_color,
            user_id: user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Profile ${editingProfile ? 'updated' : 'created'} successfully`,
      });

      // Reset form
      setNewProfile({
        name: "",
        age: "",
        type: "family",
        gender: "",
        interests: [],
        ethnicity: "",
        hair_color: "",
        customInterest: ""
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error saving sub-profile:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingProfile ? 'update' : 'create'} profile`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={newProfile.name}
          onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={newProfile.age}
          onChange={(e) => setNewProfile(prev => ({ ...prev, age: e.target.value }))}
          placeholder="Enter age"
          min="1"
          max="100"
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup
          value={newProfile.gender}
          onValueChange={(value) => setNewProfile(prev => ({ ...prev, gender: value }))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ethnicity">Ethnicity</Label>
        <Select
          value={newProfile.ethnicity}
          onValueChange={(value) => setNewProfile(prev => ({ ...prev, ethnicity: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ethnicity" />
          </SelectTrigger>
          <SelectContent>
            {ETHNICITIES.map((ethnicity) => (
              <SelectItem key={ethnicity} value={ethnicity.toLowerCase()}>
                {ethnicity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hair_color">Hair Color</Label>
        <Select
          value={newProfile.hair_color}
          onValueChange={(value) => setNewProfile(prev => ({ ...prev, hair_color: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hair color" />
          </SelectTrigger>
          <SelectContent>
            {HAIR_COLORS.map((color) => (
              <SelectItem key={color} value={color.toLowerCase()}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_INTERESTS.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={interest}
                checked={newProfile.interests.includes(interest)}
                onChange={() => handleInterestToggle(interest)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor={interest}>{interest}</Label>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add custom interest"
            value={newProfile.customInterest}
            onChange={(e) => setNewProfile(prev => ({ ...prev, customInterest: e.target.value }))}
          />
          <Button type="button" onClick={handleAddCustomInterest}>
            Add
          </Button>
        </div>
        {newProfile.interests.length > 0 && (
          <div className="mt-2">
            <Label>Selected Interests:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {newProfile.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {interest}
                  <button
                    onClick={() => handleInterestToggle(interest)}
                    className="ml-1 hover:text-destructive"
                    type="button"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Profile Type</Label>
        <Select
          value={newProfile.type}
          onValueChange={(value: 'family' | 'student') => 
            setNewProfile(prev => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="family">Family Member</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {editingProfile ? (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Update Profile
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Profile
          </>
        )}
      </Button>
      {editingProfile && (
        <Button type="button" variant="outline" className="w-full mt-2" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  );
};
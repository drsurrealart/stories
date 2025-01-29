import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRound, Users, Trash2, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface Profile {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

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

const AVAILABLE_INTERESTS = [
  "Reading",
  "Sports",
  "Music",
  "Art",
  "Science",
  "Math",
  "Languages",
  "History",
  "Technology",
  "Nature"
];

const HAIR_COLORS = [
  "Black",
  "Brown",
  "Blonde",
  "Red",
  "Gray",
  "White",
  "Other"
];

const ETHNICITIES = [
  "Asian",
  "Black",
  "Hispanic",
  "Middle Eastern",
  "Native American",
  "Pacific Islander",
  "White",
  "Mixed",
  "Other"
];

export const ProfilesTab = () => {
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    bio: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [subProfiles, setSubProfiles] = useState<SubProfile[]>([]);
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

  useEffect(() => {
    getProfile();
    getSubProfiles();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSubProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("user_sub_profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      if (data) {
        setSubProfiles(data);
      }
    } catch (error) {
      console.error("Error fetching sub-profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load sub-profiles",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setNewProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddCustomInterest = () => {
    if (newProfile.customInterest && !newProfile.interests.includes(newProfile.customInterest)) {
      setNewProfile(prev => ({
        ...prev,
        interests: [...prev.interests, prev.customInterest],
        customInterest: ""
      }));
    }
  };

  const handleNewProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      toast({
        title: "Success",
        description: "Profile created successfully",
      });

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

      getSubProfiles();
    } catch (error: any) {
      console.error("Error creating sub-profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    }
  };

  const deleteSubProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_sub_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });

      getSubProfiles();
    } catch (error: any) {
      console.error("Error deleting sub-profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>Personal Profile</span>
        </TabsTrigger>
        <TabsTrigger value="sub-profiles" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Family & Students</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={profile.first_name || ""}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={profile.last_name || ""}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={profile.avatar_url || ""}
              onChange={handleChange}
              placeholder="Enter avatar URL"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="sub-profiles">
        <Card>
          <CardHeader>
            <CardTitle>Add New Profile</CardTitle>
            <CardDescription>
              Create profiles for family members or students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewProfileSubmit} className="space-y-4">
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
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {subProfiles.map((subProfile) => (
            <Card key={subProfile.id}>
              <CardHeader>
                <CardTitle>{subProfile.name}</CardTitle>
                <CardDescription>
                  {subProfile.type === 'family' ? 'Family Member' : 'Student'} • Age: {subProfile.age}
                  {subProfile.gender && ` • ${subProfile.gender}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {subProfile.ethnicity && (
                    <div>
                      <strong>Ethnicity:</strong> {subProfile.ethnicity}
                    </div>
                  )}
                  {subProfile.hair_color && (
                    <div>
                      <strong>Hair Color:</strong> {subProfile.hair_color}
                    </div>
                  )}
                  {subProfile.interests && subProfile.interests.length > 0 && (
                    <div>
                      <strong>Interests:</strong> {subProfile.interests.join(', ')}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSubProfile(subProfile.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

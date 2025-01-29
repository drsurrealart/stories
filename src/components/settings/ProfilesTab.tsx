import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PersonalProfileForm } from "./profiles/PersonalProfileForm";
import { SubProfileForm } from "./profiles/SubProfileForm";
import { SubProfileCard } from "./profiles/SubProfileCard";

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

export const ProfilesTab = () => {
  const [subProfiles, setSubProfiles] = useState<SubProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<SubProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getSubProfiles();
  }, []);

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
        <PersonalProfileForm />
      </TabsContent>

      <TabsContent value="sub-profiles">
        <Card>
          <CardHeader>
            <CardTitle>{editingProfile ? 'Edit Profile' : 'Add New Profile'}</CardTitle>
            <CardDescription>
              {editingProfile ? 'Update profile information' : 'Create profiles for family members or students'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubProfileForm
              editingProfile={editingProfile}
              onCancel={() => setEditingProfile(null)}
              onSuccess={() => {
                setEditingProfile(null);
                getSubProfiles();
              }}
            />
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {subProfiles.map((profile) => (
            <SubProfileCard
              key={profile.id}
              profile={profile}
              onEdit={setEditingProfile}
              onDelete={deleteSubProfile}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
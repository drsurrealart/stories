import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavigationBar } from "@/components/NavigationBar";
import { AdminNav } from "@/components/admin/AdminNav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdminFunctions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [creditsToAdd, setCreditsToAdd] = useState("");
  const [selectedMembershipLevel, setSelectedMembershipLevel] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_details_secure")
        .select("*")
        .order("first_name");

      if (error) {
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const handleAddCredits = async () => {
    if (!selectedUserId || !creditsToAdd) {
      toast({
        title: "Missing information",
        description: "Please select a user and enter the number of credits to add",
        variant: "destructive",
      });
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // First get current credits
    const { data: currentCount, error: fetchError } = await supabase
      .from("user_story_counts")
      .select("credits_used")
      .eq("user_id", selectedUserId)
      .eq("month_year", currentMonth)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      toast({
        title: "Error fetching current credits",
        description: fetchError.message,
        variant: "destructive",
      });
      return;
    }

    const currentCredits = currentCount?.credits_used || 0;
    const newCredits = currentCredits + parseInt(creditsToAdd);

    const { error: updateError } = await supabase
      .from("user_story_counts")
      .upsert({
        user_id: selectedUserId,
        month_year: currentMonth,
        credits_used: newCredits,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      toast({
        title: "Error adding credits",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Credits added successfully",
      description: `Added ${creditsToAdd} credits to the user's account`,
    });

    setCreditsToAdd("");
  };

  const handleUpdateMembership = async () => {
    if (!selectedUserId || !selectedMembershipLevel) {
      toast({
        title: "Missing information",
        description: "Please select a user and a membership level",
        variant: "destructive",
      });
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        subscription_level: selectedMembershipLevel,
        updated_at: new Date().toISOString()
      })
      .eq("id", selectedUserId);

    if (updateError) {
      toast({
        title: "Error updating membership",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    // Invalidate queries to refresh the data
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });

    toast({
      title: "Membership updated successfully",
      description: `User's membership level has been updated to ${selectedMembershipLevel}`,
    });

    setSelectedMembershipLevel("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <NavigationBar onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AdminNav />
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-3xl font-bold mb-8">Admin Functions</h1>
            
            <div className="space-y-6">
              {/* Credits Management Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Credits</CardTitle>
                  <CardDescription>
                    Add additional credits to a user's account for the current month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">Select User</Label>
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id || ""}>
                            {user.first_name} {user.last_name} ({user.subscription_level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits">Number of Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      value={creditsToAdd}
                      onChange={(e) => setCreditsToAdd(e.target.value)}
                      placeholder="Enter number of credits"
                    />
                  </div>

                  <Button 
                    onClick={handleAddCredits}
                    disabled={!selectedUserId || !creditsToAdd}
                  >
                    Add Credits
                  </Button>
                </CardContent>
              </Card>

              {/* Membership Management Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Membership Level</CardTitle>
                  <CardDescription>
                    Update a user's membership level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberUser">Select User</Label>
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger id="memberUser">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id || ""}>
                            {user.first_name} {user.last_name} ({user.subscription_level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="membershipLevel">New Membership Level</Label>
                    <Select
                      value={selectedMembershipLevel}
                      onValueChange={setSelectedMembershipLevel}
                    >
                      <SelectTrigger id="membershipLevel">
                        <SelectValue placeholder="Select membership level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleUpdateMembership}
                    disabled={!selectedUserId || !selectedMembershipLevel}
                  >
                    Update Membership
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFunctions;
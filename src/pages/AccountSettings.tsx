import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilesTab } from "@/components/settings/ProfilesTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { User, Shield } from "lucide-react";

const AccountSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => navigate("/")} />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profiles">
            <div className="mt-6">
              <ProfilesTab />
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="mt-6">
              <SecurityTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;
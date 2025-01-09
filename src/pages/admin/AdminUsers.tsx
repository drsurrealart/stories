import { NavigationBar } from "@/components/NavigationBar";
import { AdminNav } from "@/components/admin/AdminNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUsers = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          subscription_level,
          created_at,
          user_story_counts (
            credits_used
          )
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        throw profilesError;
      }

      // Get user emails from auth.users through an admin function
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, email:id');

      if (authError) {
        throw authError;
      }

      // Combine the data
      return profiles.map(profile => ({
        ...profile,
        credits_used: profile.user_story_counts?.[0]?.credits_used || 0,
        email: authUsers?.find(u => u.id === profile.id)?.email || 'N/A'
      }));
    },
  });

  if (isLoading) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <div className="container mx-auto p-6">
          <div className="grid gap-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <Alert variant="destructive" className="m-6">
          <AlertDescription>
            Error loading users: {error.message}
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <NavigationBar onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AdminNav />
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Credits Used</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.first_name || ''} {user.last_name || ''}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.subscription_level || 'free'}
                      </TableCell>
                      <TableCell>{user.credits_used}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
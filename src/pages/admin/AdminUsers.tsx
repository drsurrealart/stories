import { NavigationBar } from "@/components/NavigationBar";
import { AdminNav } from "@/components/admin/AdminNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const AdminUsers = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <div className="container mx-auto p-6">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
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
            Error loading users. Please try again later.
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
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Subscription Level</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.subscription_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;

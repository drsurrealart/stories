import { NavigationBar } from "@/components/NavigationBar";
import { AdminNav } from "@/components/admin/AdminNav";
import { SubscriptionTierManager } from "@/components/admin/SubscriptionTierManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { supabase } from "@/integrations/supabase/client";

const AdminSubscriptions = () => {
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
          <div className="col-span-12 md:col-span-9 lg:col-span-10 space-y-12">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <SubscriptionTierManager />
            <ProductManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSubscriptions;
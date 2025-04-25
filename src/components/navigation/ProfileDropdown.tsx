
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Settings, CreditCard, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileDropdownProps {
  onLogout: () => void;
}

export const ProfileDropdown = ({ onLogout }: ProfileDropdownProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });
      
      if (error) {
        console.error("Admin check error:", error);
        return false;
      }
      
      return data;
    },
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Logout error:", error);
        return;
      }
      
      // Call the onLogout handler provided by parent
      onLogout();
      
      // Show success toast
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
      
      // Navigate to landing page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
      console.error("Logout unexpected error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <UserCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#2D1B69] text-gray-300 border-[#2D1B69]">
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center cursor-pointer hover:bg-[#3D2B79] hover:text-white">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3D2B79]" />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/account-settings" className="flex items-center cursor-pointer hover:bg-[#3D2B79] hover:text-white">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/my-subscriptions" className="flex items-center cursor-pointer hover:bg-[#3D2B79] hover:text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>My Subscriptions</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#3D2B79]" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer hover:bg-[#3D2B79]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

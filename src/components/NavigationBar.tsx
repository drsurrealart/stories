import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobileMenu } from "./navigation/MobileMenu";
import { NavigationItems } from "./navigation/NavigationItems";

interface NavigationBarProps {
  onLogout: () => void;
}

export const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        if (error) throw error;
        setIsAdmin(data);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      onLogout();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="font-bold text-xl">
            AI Story Time
          </Link>
          
          {isMobile ? (
            <MobileMenu
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
          ) : (
            <NavigationMenu>
              <NavigationItems isAdmin={isAdmin} onLogout={handleLogout} />
            </NavigationMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
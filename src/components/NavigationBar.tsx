import { useState, useEffect } from "react";
import { Menu, X, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationBarProps {
  onLogout: () => void;
}

export const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
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

  const navigationItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Your Stories", href: "/your-stories" },
    { title: "My Subscriptions", href: "/my-subscriptions" },
    { title: "Account Settings", href: "/account-settings" },
    ...(isAdmin ? [{ title: "Admin Dashboard", href: "/admin" }] : []),
  ];

  const NavigationItems = () => (
    <NavigationMenuList className="flex-col md:flex-row space-y-2 md:space-y-0">
      <NavigationMenuItem>
        <Link to="/create">
          <Button variant="secondary" size="sm" className="w-full md:w-auto">
            <PenTool className="mr-2 h-4 w-4" />
            Create Story
          </Button>
        </Link>
      </NavigationMenuItem>
      {navigationItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          <Link to={item.href}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "w-full md:w-auto justify-start text-white hover:text-white/90"
              )}
            >
              {item.title}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
      <NavigationMenuItem>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full md:w-auto justify-start md:justify-center text-white hover:text-white/90"
        >
          Logout
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-800/95">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="font-bold text-xl text-white">
            LearnMorals.com
          </Link>
          
          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              {isMenuOpen && (
                <div className="absolute top-14 left-0 right-0 border-b bg-gray-800 p-4">
                  <NavigationMenu className="w-full">
                    <NavigationItems />
                  </NavigationMenu>
                </div>
              )}
            </>
          ) : (
            <NavigationMenu>
              <NavigationItems />
            </NavigationMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
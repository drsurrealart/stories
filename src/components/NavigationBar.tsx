import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainNav } from "./navigation/MainNav";
import { MobileNav } from "./navigation/MobileNav";
import { ProfileDropdown } from "./navigation/ProfileDropdown";

interface NavigationBarProps {
  onLogout: () => void;
}

export const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Don't render navigation on the index page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-[#2D1B69] backdrop-blur supports-[backdrop-filter]:bg-opacity-90">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <img 
              src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png" 
              alt="LearnMorals.com Logo" 
              className="h-8 w-8"
            />
            LearnMorals.com
          </Link>
          
          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <ProfileDropdown onLogout={onLogout} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:bg-white/10"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
              <MobileNav isOpen={isMenuOpen} />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <MainNav />
              <ProfileDropdown onLogout={onLogout} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

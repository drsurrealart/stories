import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainNav } from "./navigation/MainNav";
import { MobileNav } from "./navigation/MobileNav";
import { ProfileDropdown } from "./navigation/ProfileDropdown";
import { DarkModeToggle } from "./navigation/DarkModeToggle";

interface NavigationBarProps {
  onLogout: () => void;
}

export const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-800 dark:bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-800/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="font-bold text-xl text-white">
            LearnMorals.com
          </Link>
          
          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <DarkModeToggle />
                <ProfileDropdown onLogout={onLogout} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
              <MobileNav isOpen={isMenuOpen} />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <MainNav />
              <DarkModeToggle />
              <ProfileDropdown onLogout={onLogout} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { NavigationItems } from "./NavigationItems";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export const MobileMenu = ({ isOpen, onToggle, isAdmin, onLogout }: MobileMenuProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 border-b bg-background p-4">
          <NavigationMenu className="w-full">
            <NavigationItems isAdmin={isAdmin} onLogout={onLogout} />
          </NavigationMenu>
        </div>
      )}
    </>
  );
};
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

interface NavigationBarProps {
  onLogout: () => void;
}

export const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigationItems = [
    { title: "Home", href: "/" },
    { title: "Stories", href: "/stories" },
    { title: "About", href: "/about" },
  ];

  const NavigationItems = () => (
    <NavigationMenuList className="flex-col md:flex-row space-y-2 md:space-y-0">
      {navigationItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuLink
            href={item.href}
            className={cn(
              navigationMenuTriggerStyle(),
              "w-full md:w-auto justify-start"
            )}
          >
            {item.title}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
      <NavigationMenuItem>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full md:w-auto justify-start md:justify-center"
        >
          Logout
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <div className="font-bold text-xl">AI Story Time</div>
          
          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              {isMenuOpen && (
                <div className="absolute top-14 left-0 right-0 border-b bg-background p-4">
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
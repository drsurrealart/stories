import { Link } from "react-router-dom";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavigationItemsProps {
  isAdmin: boolean;
  onLogout: () => void;
  className?: string;
}

export const NavigationItems = ({ isAdmin, onLogout, className }: NavigationItemsProps) => {
  const navigationItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Your Stories", href: "/your-stories" },
    { title: "My Subscriptions", href: "/my-subscriptions" },
    { title: "Account Settings", href: "/account-settings" },
    ...(isAdmin ? [{ title: "Admin Dashboard", href: "/admin" }] : []),
  ];

  return (
    <NavigationMenuList className={cn("flex-col md:flex-row space-y-2 md:space-y-0", className)}>
      {navigationItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          <Link to={item.href}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "w-full md:w-auto justify-start"
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
          onClick={onLogout}
          className="w-full md:w-auto justify-start md:justify-center"
        >
          Logout
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
};

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  CreditCard,
  Code,
  Stamp,
  Toggle
} from "lucide-react";

export const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Functions",
      href: "/admin/functions",
      icon: <Code className="h-4 w-4" />,
    },
    {
      title: "Watermarks",
      href: "/admin/watermarks",
      icon: <Stamp className="h-4 w-4" />,
    },
    {
      title: "Features",
      href: "/admin/features",
      icon: <Toggle className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link key={item.title} to={item.href}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              item.href === location.pathname && "bg-muted"
            )}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
};

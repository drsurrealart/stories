import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Database, Settings } from "lucide-react";

export const AdminNav = () => {
  const location = useLocation();
  
  const navigationItems = [
    { 
      title: "Overview", 
      href: "/admin", 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      title: "Users", 
      href: "/admin/users", 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      title: "Subscriptions", 
      href: "/admin/subscriptions", 
      icon: <Database className="h-4 w-4" /> 
    },
    { 
      title: "Settings", 
      href: "/admin/settings", 
      icon: <Settings className="h-4 w-4" /> 
    },
  ];

  return (
    <nav className="space-y-2 mb-8">
      <div className="flex flex-col space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.title} to={item.href}>
            <Button
              variant={location.pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};
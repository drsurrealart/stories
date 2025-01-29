import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenTool, BookOpen, Lightbulb, Heart, Music, Mic } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MainNav = () => {
  const location = useLocation();
  
  const navigationItems = [
    { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: "Create Story", href: "/create", icon: <PenTool className="h-4 w-4" /> },
    { title: "My Stories", href: "/your-stories", icon: <BookOpen className="h-4 w-4" /> },
    { title: "My Audio", href: "/my-audio", icon: <Music className="h-4 w-4" /> },
    { title: "My Narrators", href: "/my-narrators", icon: <Mic className="h-4 w-4" /> },
    { title: "My Favorites", href: "/favorites", icon: <Heart className="h-4 w-4" /> },
    { title: "My Morals", href: "/my-morals", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  return (
    <nav className="flex items-center space-x-2">
      {navigationItems.map((item) => (
        <Link key={item.title} to={item.href}>
          <Button
            variant={item.href === "/create" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "text-gray-300 hover:text-white",
              item.href === "/create" && "bg-[#E2FCE2] hover:bg-[#D0EBD0] text-gray-800 hover:text-gray-800",
              item.href === location.pathname && item.href !== "/create" && "bg-gray-700/50 text-white"
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
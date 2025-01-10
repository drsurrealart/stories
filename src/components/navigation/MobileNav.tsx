import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenTool, BookOpen, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
}

export const MobileNav = ({ isOpen }: MobileNavProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: "Create Story", href: "/create", icon: <PenTool className="h-4 w-4" /> },
    { title: "My Stories", href: "/your-stories", icon: <BookOpen className="h-4 w-4" /> },
    { title: "My Morals", href: "/my-morals", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 left-0 right-0 border-b bg-gray-800 p-4">
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.title} to={item.href} className="w-full">
            <Button
              variant={item.href === "/create" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start text-gray-300 hover:text-white",
                item.href === "/create" && "bg-[#E2FCE2] hover:bg-[#D0EBD0] text-gray-800",
                item.href === location.pathname && item.href !== "/create" && "bg-gray-700/50 text-white"
              )}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
};
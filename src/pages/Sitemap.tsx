import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, User, Shield, Globe } from "lucide-react";

const Sitemap = () => {
  const publicRoutes = [
    { path: "/", name: "Home" },
    { path: "/auth", name: "Login/Signup" },
    { path: "/explore", name: "Explore Stories" },
    { path: "/contact", name: "Contact Us" },
    { path: "/support", name: "Help Center" },
    { path: "/terms", name: "Terms & Privacy" },
    { path: "/sitemap", name: "Sitemap" },
  ];

  const memberRoutes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/create", name: "Create Story" },
    { path: "/create/adult", name: "Create Adult Story" },
    { path: "/create/kids", name: "Create Kids Story" },
    { path: "/create/teacher", name: "Create Teacher Story" },
    { path: "/your-stories", name: "Your Stories" },
    { path: "/stories-list", name: "Stories List" },
    { path: "/my-audio", name: "My Audio Stories" },
    { path: "/my-narrators", name: "My Narrators" },
    { path: "/favorites", name: "My Favorites" },
    { path: "/my-morals", name: "My Morals" },
    { path: "/account-settings", name: "Account Settings" },
    { path: "/my-subscriptions", name: "My Subscriptions" },
  ];

  const adminRoutes = [
    { path: "/admin", name: "Admin Dashboard" },
    { path: "/admin/settings", name: "Admin Settings" },
    { path: "/admin/subscriptions", name: "Subscription Management" },
    { path: "/admin/users", name: "User Management" },
    { path: "/admin/functions", name: "Admin Functions" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Site Navigation</h1>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Public Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {route.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Member Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {route.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {route.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Sitemap;
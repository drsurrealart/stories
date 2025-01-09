import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, ProtectedAdminRoute } from "@/components/auth/ProtectedRoutes";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Landing from "@/pages/Landing";
import Create from "@/pages/Create";
import YourStories from "@/pages/YourStories";
import AccountSettings from "@/pages/AccountSettings";
import MySubscriptions from "@/pages/MySubscriptions";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminSettings from "@/pages/admin/AdminSettings";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/contact" element={<Contact />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create"
      element={
        <ProtectedRoute>
          <Create />
        </ProtectedRoute>
      }
    />
    <Route
      path="/your-stories"
      element={
        <ProtectedRoute>
          <YourStories />
        </ProtectedRoute>
      }
    />
    <Route
      path="/account-settings"
      element={
        <ProtectedRoute>
          <AccountSettings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-subscriptions"
      element={
        <ProtectedRoute>
          <MySubscriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/*"
      element={
        <ProtectedAdminRoute>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </ProtectedAdminRoute>
      }
    />
  </Routes>
);
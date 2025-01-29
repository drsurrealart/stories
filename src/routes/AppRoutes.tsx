import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, ProtectedAdminRoute } from "@/components/auth/ProtectedRoutes";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Create from "@/pages/Create";
import CreateStoryStart from "@/pages/CreateStoryStart";
import KidsStoryCreator from "@/pages/KidsStoryCreator";
import TeacherStoryCreator from "@/pages/TeacherStoryCreator";
import Index from "@/pages/Index";
import MyAudio from "@/pages/MyAudio";
import MyFavorites from "@/pages/MyFavorites";
import MyMorals from "@/pages/MyMorals";
import MyNarrators from "@/pages/MyNarrators";
import YourStories from "@/pages/YourStories";
import StoriesList from "@/pages/StoriesList";
import AccountSettings from "@/pages/AccountSettings";
import MySubscriptions from "@/pages/MySubscriptions";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminFunctions from "@/pages/admin/AdminFunctions";
import Explore from "@/pages/Explore";
import Sitemap from "@/pages/Sitemap";
import Share from "@/pages/Share";
import Support from "@/pages/Support";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/support" element={<Support />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/share" element={<Share />} />
      
      {/* Protected routes */}
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
            <CreateStoryStart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/adult"
        element={
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/kids"
        element={
          <ProtectedRoute>
            <KidsStoryCreator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/teacher"
        element={
          <ProtectedRoute>
            <TeacherStoryCreator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-audio"
        element={
          <ProtectedRoute>
            <MyAudio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-narrators"
        element={
          <ProtectedRoute>
            <MyNarrators />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <MyFavorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-morals"
        element={
          <ProtectedRoute>
            <MyMorals />
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
        path="/stories-list"
        element={
          <ProtectedRoute>
            <StoriesList />
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

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettings />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedAdminRoute>
            <AdminSubscriptions />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedAdminRoute>
            <AdminUsers />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/functions"
        element={
          <ProtectedAdminRoute>
            <AdminFunctions />
          </ProtectedAdminRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

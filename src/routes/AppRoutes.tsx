import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
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
import YourStories from "@/pages/YourStories";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
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

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
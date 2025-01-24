import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Create from "@/pages/Create";
import CreateStoryStart from "@/pages/CreateStoryStart";
import KidsStoryCreator from "@/pages/KidsStoryCreator";
import TeacherStoryCreator from "@/pages/TeacherStoryCreator";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
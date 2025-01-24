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
      
      <Route element={<ProtectedRoute />}>
        <Route path="/create" element={<CreateStoryStart />} />
        <Route path="/create/adult" element={<Create />} />
        <Route path="/create/kids" element={<KidsStoryCreator />} />
        <Route path="/create/teacher" element={<TeacherStoryCreator />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
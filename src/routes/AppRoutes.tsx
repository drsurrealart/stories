import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "@/components/auth/ProtectedRoutes";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Create from "@/pages/Create";
import CreateStoryStart from "@/pages/CreateStoryStart";
import CreateKidsStory from "@/pages/CreateKidsStory";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route element={<ProtectedRoutes />}>
        <Route path="/create-story" element={<CreateStoryStart />} />
        <Route path="/create" element={<Create />} />
        <Route path="/create-kids-story" element={<CreateKidsStory />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

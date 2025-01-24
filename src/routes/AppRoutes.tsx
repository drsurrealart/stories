import { Routes, Route } from "react-router-dom";
import CreateStoryStart from "@/pages/CreateStoryStart";
import KidsStoryCreator from "@/pages/KidsStoryCreator";
import ParentsStoryCreator from "@/pages/ParentsStoryCreator";
import TeacherStoryCreator from "@/pages/TeacherStoryCreator";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreateStoryStart />} />
      <Route path="/create/kids" element={<KidsStoryCreator />} />
      <Route path="/create/parents" element={<ParentsStoryCreator />} />
      <Route path="/create/teacher" element={<TeacherStoryCreator />} />
    </Routes>
  );
}
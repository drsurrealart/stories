import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import AccountSettings from "./pages/AccountSettings";
import YourStories from "./pages/YourStories";
import AdminDashboard from "./pages/AdminDashboard";
import MySubscriptions from "./pages/MySubscriptions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={<Index />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/stories" element={<YourStories />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/subscriptions" element={<MySubscriptions />} />
      </Routes>
    </Router>
  );
}

export default App;
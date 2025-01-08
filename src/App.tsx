import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { YourStories } from "./pages/YourStories";
import { MySubscriptions } from "./pages/MySubscriptions";
import { AccountSettings } from "./pages/AccountSettings";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavigationBar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/your-stories" element={<YourStories />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
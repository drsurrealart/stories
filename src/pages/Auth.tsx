import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_up");

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
      }
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png" 
              alt="AI Story Time Logo" 
              className="w-24 h-24 mb-4"
            />
            <h1 className="text-3xl font-bold text-center">Welcome</h1>
            <h2 className="text-xl font-semibold text-primary mt-4">
              {view === "sign_up" ? "Signup Free" : "Login Now"}
            </h2>
          </div>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                  },
                },
              },
              style: {
                button: {
                  borderRadius: '8px',
                },
                anchor: {
                  color: '#9b87f5',
                },
              },
            }}
            providers={[]}
            view={view}
            onViewChange={(newView) => {
              if (newView === "sign_in" || newView === "sign_up") {
                setView(newView);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
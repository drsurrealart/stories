import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check:", session ? "Active" : "No session");
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, "Session:", session ? "Active" : "No session");

      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
        navigate('/auth', { replace: true });
        toast({
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User is authenticated");
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found for admin check");
          setIsAdmin(false);
          return;
        }
        
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: session.user.id
        });
        
        if (error) {
          console.error("Admin check error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not verify admin status.",
          });
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(data);
      } catch (error) {
        console.error("Admin check error:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
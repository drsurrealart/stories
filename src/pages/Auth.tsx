import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Clear any existing timeout to prevent multiple checks
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (event === 'SIGNED_IN' && session) {
        // Add a small delay before redirecting to ensure session is properly set
        timeoutId = setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }

      if (event === 'SIGNED_OUT') {
        setErrorMessage("");
      }

      // Handle specific auth errors
      if (event === 'USER_UPDATED') {
        try {
          const { error } = await supabase.auth.getSession();
          if (error) {
            if (error.status === 429) {
              toast({
                title: "Too many requests",
                description: "Please wait a moment before trying again",
                variant: "destructive",
              });
            } else {
              setErrorMessage(getErrorMessage(error));
            }
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          setErrorMessage(error.message);
        }
      }
    });

    // Check if user is already signed in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
              },
            },
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

const getErrorMessage = (error: any) => {
  if (error.status === 406) {
    return "No data found. Please try again.";
  }
  if (error.status === 429) {
    return "Too many requests. Please wait a moment before trying again.";
  }
  return error.message || "An error occurred. Please try again.";
};

export default Auth;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const REDIRECT_DELAY = 1000; // 1 second delay before redirect
const RATE_LIMIT_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;

    const handleAuthChange = async (event: string, session: any) => {
      // Clear any existing timeouts
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);

      if (event === 'SIGNED_IN' && session) {
        // Add a delay before redirecting to ensure session is properly set
        timeoutId = setTimeout(() => {
          navigate('/dashboard');
        }, REDIRECT_DELAY);
      }

      if (event === 'SIGNED_OUT') {
        setErrorMessage("");
        setRetryCount(0);
      }

      // Handle session check
      if (event === 'USER_UPDATED') {
        try {
          const { error } = await supabase.auth.getSession();
          if (error) {
            if (error.status === 429 && retryCount < MAX_RETRIES) {
              // Rate limit reached - implement exponential backoff
              const delay = RATE_LIMIT_RETRY_DELAY * Math.pow(2, retryCount);
              toast({
                title: "Rate limit reached",
                description: `Retrying in ${delay/1000} seconds...`,
                variant: "destructive",
              });
              
              retryTimeoutId = setTimeout(async () => {
                setRetryCount(prev => prev + 1);
                const { error: retryError } = await supabase.auth.getSession();
                if (!retryError) {
                  setErrorMessage("");
                  setRetryCount(0);
                }
              }, delay);
            } else {
              setErrorMessage(getErrorMessage(error));
            }
          } else {
            setRetryCount(0);
            setErrorMessage("");
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          setErrorMessage(error.message);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check if user is already signed in
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (error.status === 429) {
            toast({
              title: "Rate limit reached",
              description: "Please wait a moment before trying again",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }
        if (session) {
          timeoutId = setTimeout(() => {
            navigate('/dashboard');
          }, REDIRECT_DELAY);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        setErrorMessage(getErrorMessage(error));
      }
    };
    
    checkSession();

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, [navigate, toast, retryCount]);

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
  if (error.message === "Failed to fetch") {
    return "Network error. Please check your connection and try again.";
  }
  return error.message || "An error occurred. Please try again.";
};

export default Auth;
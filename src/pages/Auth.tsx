import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from "lucide-react";

const REDIRECT_DELAY = 1000;
const RATE_LIMIT_RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;

    const handleAuthChange = async (event: string, session: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);

      if (event === 'SIGNED_IN' && session) {
        timeoutId = setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || '/create';
          navigate(from);
        }, REDIRECT_DELAY);
      }

      if (event === 'SIGNED_OUT') {
        setErrorMessage("");
        setRetryCount(0);
      }

      if (event === 'USER_UPDATED') {
        try {
          const { error } = await supabase.auth.getSession();
          if (error) {
            if (error.status === 429 && retryCount < MAX_RETRIES) {
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
          const from = (location.state as any)?.from?.pathname || '/create';
          navigate(from);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        setErrorMessage(getErrorMessage(error));
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, [navigate, toast, retryCount, location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F1F0FB] to-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="block">
            <img 
              src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png" 
              alt="Logo" 
              className="h-16 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1A1F2C]">
              {view === "sign_in" ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {view === "sign_in" 
                ? "Sign in to continue your storytelling journey" 
                : "Join us and start creating magical stories"}
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView("sign_in")}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-colors
                ${view === "sign_in" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => setView("sign_up")}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-colors
                ${view === "sign_up" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <SupabaseAuth
            supabaseClient={supabase}
            view={view}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#F1F0FB',
                    defaultButtonBackgroundHover: '#E5DEFF',
                    inputBackground: 'white',
                    inputBorder: '#E2E8F0',
                    inputBorderHover: '#9b87f5',
                    inputBorderFocus: '#9b87f5',
                  },
                  borderWidths: {
                    buttonBorderWidth: '0px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'font-medium hover:opacity-90 transition-opacity',
                input: 'bg-white border-gray-200',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            providers={[]}
          />
        </Card>
      </div>
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

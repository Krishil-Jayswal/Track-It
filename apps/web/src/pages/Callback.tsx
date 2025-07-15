import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Brain } from "lucide-react";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store token and redirect to dashboard
      login(token);
      toast({
        title: "Welcome to Track It!",
        description: "You've been successfully logged in.",
      });
      navigate("/dashboard", { replace: true });
    } else {
      // No token found, show error and redirect to auth
      toast({
        title: "Authentication Failed",
        description: "Login was unsuccessful. Please try again.",
        variant: "destructive",
      });
      navigate("/auth", { replace: true });
    }
  }, [searchParams, login, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}

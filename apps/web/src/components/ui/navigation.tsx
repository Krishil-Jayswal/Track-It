import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Brain } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const isLandingPage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (isLandingPage) {
    return (
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Brain
                className="h-8 w-8 bg-gradient-primary bg-clip-text text-transparent animate-pulse"
                style={{
                  background:
                    "linear-gradient(45deg, #fff 0%, #8B5CF6 20%, #EC4899 40%, #F59E0B 60%, #10B981 80%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              />
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                Track It
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Dashboard navigation
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Brain
              className="h-6 w-6"
              style={{
                background:
                  "linear-gradient(45deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
            <span className="font-semibold text-lg">Track It</span>
          </Link>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

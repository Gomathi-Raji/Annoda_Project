import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";

const UserLogin = () => {
  const { signInWithGoogle, user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fromRoute = (location.state as { from?: string } | null)?.from || "/customize";

  useEffect(() => {
    if (user) {
      navigate(fromRoute, { replace: true });
    }
  }, [fromRoute, navigate, user]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate(fromRoute, { replace: true });
    } catch (loginError) {
      console.error(loginError);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-16">
        <div className="container max-w-md">
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h1 className="font-heading text-2xl md:text-3xl text-center">
              User <span className="text-primary">Login</span>
            </h1>

            <p className="text-sm text-muted-foreground text-center">
              Sign in with your Google account to continue.
            </p>

            <Button
              type="button"
              size="lg"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full font-heading uppercase tracking-widest glow-primary"
            >
              {loading ? "Signing In..." : "Continue with Google"}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <div className="text-center">
              <Button asChild variant="link" className="text-muted-foreground">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default UserLogin;
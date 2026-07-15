import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "sonner";

const UserLogin = () => {
  const { signInWithGoogle, sendSignInLink, user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await sendSignInLink(email);
      window.localStorage.setItem("emailForSignIn", email);
      setLinkSent(true);
      toast.success("Magic link sent! Please check your email inbox.");
    } catch (linkError: any) {
      console.error(linkError);
      setError(linkError.message || "Failed to send login link. Please try again.");
      toast.error("Failed to send login link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-16">
        <div className="container max-w-md">
          <div className="rounded-lg border border-border bg-card p-6 space-y-6 shadow-md">
            <h1 className="font-heading text-2xl md:text-3xl text-center font-bold">
              User <span className="text-primary font-bold">Login</span>
            </h1>

            {linkSent ? (
              <div className="space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3 mx-auto w-fit">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a magic link to <strong className="text-foreground">{email}</strong>.
                  Click the link in the email to instantly sign in.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLinkSent(false)}
                  className="w-full mt-2"
                >
                  Change Email or Resend
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background border-muted focus-visible:ring-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full font-heading uppercase tracking-widest glow-primary"
                  >
                    {loading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </form>

                <div className="relative flex items-center justify-center">
                  <hr className="w-full border-muted" />
                  <span className="absolute bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
                    Or
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full font-heading uppercase tracking-widest border-muted hover:bg-accent"
                >
                  {loading ? "Signing In..." : "Continue with Google"}
                </Button>
              </>
            )}

            {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}

            <div className="text-center pt-2">
              <Button asChild variant="link" className="text-muted-foreground hover:text-foreground">
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
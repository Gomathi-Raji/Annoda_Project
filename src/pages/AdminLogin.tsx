import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api, { ADMIN_TOKEN_KEY } from "@/lib/api";

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    expiresInMs: number;
  };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/api/admin/login", {
        username: username.trim(),
        password
      });

      localStorage.setItem(ADMIN_TOKEN_KEY, response.data.data.token);
      navigate((location.state as { from?: string } | null)?.from || "/admin", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("Invalid credentials. Please try again.");
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
              Admin <span className="text-primary">Login</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin username"
                  autoComplete="username"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoComplete="current-password"
                  className="bg-secondary border-border"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" size="lg" disabled={loading} className="w-full font-heading uppercase tracking-widest glow-primary">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

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

export default AdminLogin;
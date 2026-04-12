import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();

  const fallbackName = user?.displayName || user?.email || "User";
  const initials = fallbackName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-6">
            <h1 className="font-heading text-3xl md:text-4xl text-center">
              Your <span className="text-primary">Profile</span>
            </h1>

            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 border border-border">
                <AvatarImage src={user?.photoURL ?? undefined} alt={fallbackName} />
                <AvatarFallback className="font-heading text-lg">{initials || "U"}</AvatarFallback>
              </Avatar>
              <p className="font-heading text-lg text-center">{user?.displayName || "Google User"}</p>
              <p className="text-sm text-muted-foreground text-center break-all">{user?.email || "No email available"}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Button asChild variant="outline" className="font-heading uppercase tracking-wider">
                <Link to="/customize">Customize</Link>
              </Button>
              <Button asChild variant="outline" className="font-heading uppercase tracking-wider">
                <Link to="/order">Order</Link>
              </Button>
              <Button onClick={handleLogout} className="font-heading uppercase tracking-wider">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;
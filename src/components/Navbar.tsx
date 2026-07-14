import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/1000518709-03.jpeg";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/customize", label: "Customize" },
  { to: "/about", label: "About" },
  { to: "/admin", label: "Admin" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signInWithGoogle, logout } = useUserAuth();

  const fallbackName = user?.displayName || user?.email || "User";
  const initials = fallbackName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogin = async () => {
    setAuthLoading(true);

    try {
      await signInWithGoogle();
      navigate("/customize");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);

    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-10">
          <img src={logo} alt="Kase Brothers" className="h-10 w-auto rounded-full mix-blend-multiply" />
        </Link>

        {/* Brand Text - Centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="font-heading text-lg md:text-xl uppercase tracking-widest text-primary font-bold">Kase Brothers</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 z-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.photoURL ?? undefined} alt={fallbackName} />
                    <AvatarFallback className="font-heading text-xs">{initials || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{fallbackName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={authLoading}>
                  {authLoading ? "Please wait..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} disabled={authLoading} size="sm" className="font-heading uppercase tracking-wider">
              {authLoading ? "Please wait..." : "Login"}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 rounded-md border border-border p-2"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user.photoURL ?? undefined} alt={fallbackName} />
                  <AvatarFallback className="font-heading text-xs">{initials || "U"}</AvatarFallback>
                </Avatar>
                <span className="truncate text-sm text-muted-foreground">{fallbackName}</span>
              </button>
              <Button onClick={handleLogout} disabled={authLoading} size="sm" className="w-full font-heading uppercase tracking-wider">
                {authLoading ? "Please wait..." : "Logout"}
              </Button>
            </div>
          ) : (
            <Button onClick={handleLogin} disabled={authLoading} size="sm" className="w-full font-heading uppercase tracking-wider">
              {authLoading ? "Please wait..." : "Login"}
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

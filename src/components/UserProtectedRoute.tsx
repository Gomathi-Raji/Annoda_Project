import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

const UserProtectedRoute = () => {
  const location = useLocation();
  const { user, loading } = useUserAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ADMIN_TOKEN_KEY } from "@/lib/api";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
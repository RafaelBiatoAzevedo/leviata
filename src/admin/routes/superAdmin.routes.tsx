import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function SuperAdminRoute() {
  const { user } = useAuth();
  return user?.role === "SUPER_ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" replace />
  );
}

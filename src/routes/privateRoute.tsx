import { Navigate, Outlet } from "react-router-dom";
import { storageKeys } from "../constants/storageKeys";

export function PrivateRoute() {
  const token = localStorage.getItem(storageKeys.TOKEN_KEY);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

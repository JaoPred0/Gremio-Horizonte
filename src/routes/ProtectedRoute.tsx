import { Navigate, Outlet } from "react-router-dom";
import { auth } from "@/lib/firebase";

export default function ProtectedRoute() {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/login" replace />;
  if (!user.emailVerified) return <Navigate to="/login" replace />;

  return <Outlet />;
}

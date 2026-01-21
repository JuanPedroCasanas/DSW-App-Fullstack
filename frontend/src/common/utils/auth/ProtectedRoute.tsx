import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/common/utils/auth/AuthContext";

export default function ProtectedRoute({ roles }: 
  { roles?: string[] }) {
  const { user } = useAuth();

  //si no hay usuario:
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // para los roles:
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/about" replace />;
  }

  // para anidar las rutas en App.tsx
  return <Outlet />;
}


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

    const roleRedirectMap: Record<string, string> = {
      admin: "/debug-console",
      professional: "/professional-portal",
      patient: "/patient-portal",
      legalGuardian: "/legal-guardian-portal",
    };

    const redirectTo = roleRedirectMap[user.role] ?? "/";

    return <Navigate to={ redirectTo } replace />;
  }

  // para anidar las rutas en App.tsx
  return <Outlet />;
}


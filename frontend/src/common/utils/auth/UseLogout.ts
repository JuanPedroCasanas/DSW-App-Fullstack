import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "./TokenStorage";
import { useAuth } from "./AuthContext";

export function useLogout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate, setUser]);

  return logout;
}

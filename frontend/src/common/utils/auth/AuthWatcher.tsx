import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "./TokenStorage";
import { AUTH_401_EVENT } from "./AuthEvents";
import { useAuth } from "./AuthContext";

//Redirige al usuario al login al detectar un evento global emitido por AuthEvents de tipo 401 token expirado

export default function AuthWatcher() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    function onUnauthorized() {
      clearAccessToken();
      setUser(null);
      navigate("/login");
    }

    window.addEventListener(AUTH_401_EVENT, onUnauthorized);
    return () => {
      window.removeEventListener(AUTH_401_EVENT, onUnauthorized);
    };
  }, [navigate, setUser]);

  return null; 
}
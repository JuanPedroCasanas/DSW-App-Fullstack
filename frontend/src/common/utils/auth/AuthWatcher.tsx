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

    /* 
    PARA CUANDO LOS ROLES DEL BACKEND ESTEN 100% FUNCIONALES!
    function onForbidden() {
      navigate("/home");
    }

    windows.addEventListener(AUTH_403_EVENT, onForbidden);
    */

    window.addEventListener(AUTH_401_EVENT, onUnauthorized);
    return () => {
      window.removeEventListener(AUTH_401_EVENT, onUnauthorized);
      // windows.EventListener(AUTH_403_EVENT, onForbidden);
    };
  }, [navigate, setUser]);

  return null; 
}
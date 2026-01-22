import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_401_EVENT } from "./AuthEvents";
import { useLogout } from "./UseLogout";

//Redirige al usuario al login al detectar un evento global emitido por AuthEvents de tipo 401 token expirado

export default function AuthWatcher() {
  const navigate = useNavigate();
  const logout = useLogout();

  const onUnauthorized = useCallback(() => {
    logout();
  }, [logout]);

  // actualmente no tiene uso, ya que no tenemos la parte de roles en el backend
  const onForbidden = useCallback((e: Event) => {
    navigate("/home", { replace: true }); 
  }, [navigate]);

  useEffect(() => {
    window.addEventListener(AUTH_401_EVENT, onUnauthorized);
   // window.addEventListener(AUTH_403_EVENT, onForbidden);
    return () => {
      window.removeEventListener(AUTH_401_EVENT, onUnauthorized);
     // window.removeEventListener(AUTH_403_EVENT, onForbidden);
    };
  }, [onUnauthorized, onForbidden]);


  return null; 
}
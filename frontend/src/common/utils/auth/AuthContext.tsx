import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken } from "./TokenStorage";
import { API_BASE } from '@/lib/api';

// crea un contexto de autenticación
// llama a /User/refresh (con cookies) para obtener 
// un access token nuevo y datos del usuario, y los guarda en el contexto y en TokenStorage.

type AuthContextType = {
  user: any | null;
  setUser: (u: any | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/User/refresh`, {
          method: "GET",
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error();
        } 

        const data = await res.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
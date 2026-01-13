import { createContext, useContext, useEffect, useState } from "react";

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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
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
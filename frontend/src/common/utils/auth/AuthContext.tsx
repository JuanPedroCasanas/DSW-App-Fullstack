import { createContext, useContext, useState } from "react";

//Guarda los datos del usuario (user)
//Permite actualizarlo (setUser)
//Expone esos datos con un Context
// solo maneja estado global y no lógica de autorización

type AuthContextType = {
  user: any | null;
  setUser: (u: any | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// provee la info, no hace control de roles
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
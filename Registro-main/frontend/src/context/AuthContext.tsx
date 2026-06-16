import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuthToken, setAuthToken } from "../api/client";
import * as apiEndpoints from "../api/endpoints";
import { AuthUser } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "registro_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const stored = localStorage.getItem(USER_KEY);
    if (token && stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      async login(correo, password) {
        const result = await apiEndpoints.login(correo, password);
        setAuthToken(result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setUser(result.user);
      },
      logout() {
        setAuthToken(null);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

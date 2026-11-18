
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api, type User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("bookbazar_token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const result = await api.me(token);
      setUser(result.user ?? null);
    } catch {
      localStorage.removeItem("bookbazar_token");
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login({ email, password });

    if (!result.token || !result.user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("bookbazar_token", result.token);
    setUser(result.user);
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    const result = await api.register({
      fullName,
      email,
      password,
    });

    if (!result.token || !result.user) {
      throw new Error("Invalid registration response");
    }

    localStorage.setItem("bookbazar_token", result.token);
    setUser(result.user);
  };

  const logout = async () => {
    const token = localStorage.getItem("bookbazar_token");

    try {
      if (token) await api.logout(token);
    } finally {
      localStorage.removeItem("bookbazar_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}


import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  register as registerUser,
  login as loginUser,
  refreshSession,
  getCurrentUser,
  logout as logoutUser,
  logoutAll as logoutAllUser,
  resendVerificationEmail as resendVerification,
} from "../services/auth.service";

import { clearAccessToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initializationStarted = useRef(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const response = await getCurrentUser();
    const currentUser = response?.user ?? response;

    setUser(currentUser);
    setIsAuthenticated(true);

    return currentUser;
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      await refreshSession();
      await loadUser();
    } catch {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  useEffect(() => {
    if (initializationStarted.current) return;

    initializationStarted.current = true;
    initializeAuth();
  }, [initializeAuth]);

  const register = async (userData) => {
    return registerUser(userData);
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const loggedInUser = response.user;

    if (!loggedInUser) {
      clearAccessToken();
      throw new Error("User information was not returned by the server.");
    }

    setUser(loggedInUser);
    setIsAuthenticated(true);

    return response;
  };

  const resendVerificationEmail = async () => {
    return resendVerification();
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logoutAll = async () => {
    try {
      await logoutAllUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    return loadUser();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    logoutAll,
    refreshUser,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}

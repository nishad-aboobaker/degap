import { useState, useEffect } from "react";
import authService from "../services/auth.service";
import { AuthContext } from "./AuthContextDefinition";

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    register,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isContributor: user?.role === "contributor" || user?.role === "admin",
  };
}

export function AuthProvider({ children }) {
  const value = useProvideAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

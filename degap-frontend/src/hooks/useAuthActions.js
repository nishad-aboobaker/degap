import { useAuth } from "./useAuth";

export function useAuthActions() {
  const { register, login, logout, checkAuth } = useAuth();

  return {
    register,
    login,
    logout,
    checkAuth,
  };
}


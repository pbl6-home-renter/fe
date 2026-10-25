import { useAuthStore } from '@/stores/auth-store';

export const useAuthSession = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuth = useAuthStore((state) => state.setAuth);

  return {
    user,
    role: user?.role,
    isAuthenticated,
    clearAuth,
    setUser,
    setAuth,
  };
};

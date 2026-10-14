import { useAuthStore } from '@/stores/auth-store';
import type { User, Role } from '@/types/user';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const role: Role | null = user?.role ?? null;

  const login = (userData: User, tokens: { accessToken: string; refreshToken?: string } | string) => {
    const token = typeof tokens === 'string' ? tokens : tokens.accessToken;
    setAuth(userData, token);
  };

  const logout = () => {
    clearAuth();
  };

  return {
    user,
    role,
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
};



import { useAuthStore } from '@/stores/auth-store';
import { useCurrentUserQuery } from '@/features/auth/hooks/auth/use-current-user-query';
import type { Role } from '@/types/role';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const currentUserQuery = useCurrentUserQuery();

  const isRestoringSession =
    isHydrated &&
    (isAuthenticated || !!accessToken) &&
    !user &&
    !currentUserQuery.isError;

  return {
    user,
    role: (user?.role ?? null) as Role | null,
    accessToken,
    refreshToken,
    isAuthenticated,
    isHydrated,
    isRestoringSession,
    currentUserQuery,
    setAuth,
    clearAuth,
    login: setAuth,
    logout: clearAuth,
  };
};

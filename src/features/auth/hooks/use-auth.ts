import { useAuthStore } from '@/stores/auth-store';
import { useCurrentUserQuery } from './use-current-user-query';
import type { Role } from '@/types/role';
import { UserStatus } from '@/types/user';

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
    isHydrated && (isAuthenticated || !!accessToken) && (!user || !user.status) && !currentUserQuery.isError;

  return {
    user,
    role: (user?.role ?? null) as Role | null,
    isLocked: user?.status === UserStatus.LOCKED,
    isActiveUser: user?.status === UserStatus.ACTIVE,
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

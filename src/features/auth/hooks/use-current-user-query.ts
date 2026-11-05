import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../api/auth.api';
import { AUTH_QUERY_KEYS } from '../constants/auth.constants';

/**
 * Loads `/me` into the auth store when only the tokens were persisted, or when the
 * stored user came from the login response, which omits `status` (the realtime
 * socket only connects for an `active` user).
 */
export const useCurrentUserQuery = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ME,
    queryFn: async () => {
      try {
        const profile = await authApi.getProfile();
        setUser(profile);
        return profile;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          clearAuth();
          queryClient.clear();
        }
        throw error;
      }
    },
    enabled: (isAuthenticated || !!accessToken) && !user?.status,
    retry: false,
  });
};

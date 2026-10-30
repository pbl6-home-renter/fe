import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../api/auth.api';
import { AUTH_QUERY_KEYS } from '../constants/auth.constants';

/** Loads `/me` into the auth store when only the tokens were persisted. */
export const useCurrentUserQuery = () => {
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
        }
        throw error;
      }
    },
    enabled: (isAuthenticated || !!accessToken) && !user,
    retry: false,
  });
};

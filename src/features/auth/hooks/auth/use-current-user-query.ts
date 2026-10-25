import {
  useAppQuery,
  queryKeys,
  type UseAppQueryOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type { UserProfile } from '@/features/auth/types/auth.dto';
import { useAuthStore } from '@/stores/auth-store';

export const useCurrentUserQuery = (
  options?: Partial<UseAppQueryOptions<UserProfile, Error, UserProfile, typeof queryKeys.auth.me>>
) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useAppQuery<UserProfile, Error, UserProfile, typeof queryKeys.auth.me>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const profile = await authApi.getProfile();
        setUser(profile);
        return profile;
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'response' in err &&
          (err as { response?: { status?: number } }).response?.status === 401
        ) {
          clearAuth();
        }
        throw err;
      }
    },
    enabled: (isAuthenticated || !!accessToken) && !user,
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });
};

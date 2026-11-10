import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserMeResponseDto } from '../types/users.dto';

export const useMyProfileQuery = (options?: QueryHookOptions<UserMeResponseDto>) => {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: USERS_QUERY_KEYS.ME(userId),
    queryFn: async () => {
      const profile = await usersApi.getMe();
      const currentUser = useAuthStore.getState().user;
      // Identity GET /me omits avatarUrl; keep session avatar only when the user ID matches.
      const mergedProfile: UserMeResponseDto = {
        ...profile,
        avatarUrl: profile.avatarUrl ?? (currentUser?.id === profile.id ? currentUser.avatarUrl : null),
      };
      setUser(mergedProfile);
      return mergedProfile;
    },
    enabled: (isAuthenticated || Boolean(accessToken)) && (options?.enabled ?? true),
    retry: false,
    ...options,
  });
};

import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserDetailAdminDto } from '../types/users.dto';

export const useUserDetailAdminQuery = (userId: string, options?: QueryHookOptions<UserDetailAdminDto>) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.DETAIL(userId),
    queryFn: () => usersApi.getUserDetailAdmin(userId),
    enabled: Boolean(userId),
    ...options,
  });
};

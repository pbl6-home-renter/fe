import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserListAdminItemDto, UserListAdminParams } from '../types/users.dto';

export const useUsersAdminQuery = (
  params?: UserListAdminParams,
  options?: QueryHookOptions<Paginated<UserListAdminItemDto>>,
) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.LIST(params),
    queryFn: () => usersApi.getUsersAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

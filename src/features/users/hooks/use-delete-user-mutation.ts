import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';

export const useDeleteUserMutation = (options?: MutationHookOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserLockRequestDto, UserLockResponseDto } from '../types/users.dto';

interface LockUserVariables {
  userId: string;
  payload: UserLockRequestDto;
}

export const useLockUserMutation = (options?: MutationHookOptions<UserLockResponseDto, LockUserVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: LockUserVariables) => usersApi.lockUser(userId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

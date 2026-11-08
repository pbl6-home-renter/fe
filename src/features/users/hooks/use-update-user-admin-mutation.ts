import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserUpdateAdminRequestDto, UserUpdateAdminResponseDto } from '../types/users.dto';

interface UpdateUserVariables {
  userId: string;
  payload: UserUpdateAdminRequestDto;
}

export const useUpdateUserAdminMutation = (
  options?: MutationHookOptions<UserUpdateAdminResponseDto, UpdateUserVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserVariables) => usersApi.updateUserAdmin(userId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

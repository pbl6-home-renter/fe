import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { usersApi } from '../api/users.api';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserMeResponseDto, UserUpdateMeRequestDto, UserUpdateMeResponseDto } from '../types/users.dto';

export const useUpdateMeMutation = (options?: MutationHookOptions<UserUpdateMeResponseDto, UserUpdateMeRequestDto>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateMe,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      const { user, setUser } = useAuthStore.getState();
      if (user && user.id === data.id) {
        const updatedUser: UserMeResponseDto = {
          ...user,
          name: data.name,
          phone: data.phone,
          payoutAccount: data.payoutAccount,
        };
        setUser(updatedUser);
        queryClient.setQueryData(USERS_QUERY_KEYS.ME(data.id), updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

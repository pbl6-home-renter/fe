import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../api/auth.api';
import { AUTH_QUERY_KEYS } from '../constants/auth.constants';
import type { AuthLogoutRequestDto } from '../types/auth.dto';

/** Logs out on the server; the local session is cleared even when that call fails. */
export const useLogoutMutation = (
  options?: MutationHookOptions<void, AuthLogoutRequestDto | void>
) => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const clearSession = async () => {
    clearAuth();
    await queryClient.resetQueries({ queryKey: AUTH_QUERY_KEYS.ALL });
  };

  return useMutation({
    mutationFn: (body) => authApi.logout(body ?? undefined),
    ...options,
    onSuccess: async (...args) => {
      await clearSession();
      return options?.onSuccess?.(...args);
    },
    onError: async (...args) => {
      await clearSession();
      return options?.onError?.(...args);
    },
  });
};

import {
  useAppMutation,
  resetAuthQueries,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type { AuthLogoutRequestDto } from '@/features/auth/types/auth.dto';
import { useAuthStore } from '@/stores/auth-store';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useLogoutMutation = (
  options?: Partial<UseAppMutationOptions<void, Error, AuthLogoutRequestDto | void>>
) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useAppMutation<void, Error, AuthLogoutRequestDto | void>({
    mutationFn: (variables) => {
      const refreshToken =
        variables?.refreshToken ?? useAuthStore.getState().refreshToken ?? '';
      return authApi.logout({ refreshToken });
    },
    successCode: AUTH_SUCCESS_CODES.LOGGED_OUT,
    ...options,
    onSuccess: async (...args) => {
      clearAuth();
      await resetAuthQueries();
      options?.onSuccess?.(...args);
    },
    onError: async (...args) => {
      clearAuth();
      await resetAuthQueries();
      options?.onError?.(...args);
    },
  });
};

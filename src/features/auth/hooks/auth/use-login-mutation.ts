import {
  useAppMutation,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
} from '@/features/auth/types/auth.dto';
import { useAuthStore } from '@/stores/auth-store';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useLoginMutation = (
  options?: Partial<UseAppMutationOptions<AuthLoginResponseDto, Error, AuthLoginRequestDto>>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useAppMutation<AuthLoginResponseDto, Error, AuthLoginRequestDto>({
    mutationFn: (credentials: AuthLoginRequestDto) => authApi.login(credentials),
    successCode: AUTH_SUCCESS_CODES.LOGGED_IN,
    ...options,
    onSuccess: (data, ...args) => {
      const user = data.user || data.profile;
      if (user) {
        setAuth(user, data.accessToken, data.refreshToken);
      }
      options?.onSuccess?.(data, ...args);
    },
  });
};

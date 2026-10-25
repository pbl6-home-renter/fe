import {
  useAppMutation,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type { AuthResetPasswordRequestDto } from '@/features/auth/types/auth.dto';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useResetPasswordMutation = (
  options?: Partial<UseAppMutationOptions<void, Error, AuthResetPasswordRequestDto>>
) => {
  return useAppMutation<void, Error, AuthResetPasswordRequestDto>({
    mutationFn: (payload: AuthResetPasswordRequestDto) => authApi.resetPassword(payload),
    successCode: AUTH_SUCCESS_CODES.PASSWORD_RESET,
    ...options,
  });
};

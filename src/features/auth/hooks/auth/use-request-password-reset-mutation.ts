import {
  useAppMutation,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type {
  AuthRequestPasswordResetRequestDto,
  AuthRequestPasswordResetResponseDto,
} from '@/features/auth/types/auth.dto';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useRequestPasswordResetMutation = (
  options?: Partial<
    UseAppMutationOptions<
      AuthRequestPasswordResetResponseDto,
      Error,
      AuthRequestPasswordResetRequestDto
    >
  >
) => {
  return useAppMutation<
    AuthRequestPasswordResetResponseDto,
    Error,
    AuthRequestPasswordResetRequestDto
  >({
    mutationFn: (payload: AuthRequestPasswordResetRequestDto) =>
      authApi.requestPasswordReset(payload),
    successCode: AUTH_SUCCESS_CODES.PASSWORD_RESET_REQUESTED,
    ...options,
  });
};

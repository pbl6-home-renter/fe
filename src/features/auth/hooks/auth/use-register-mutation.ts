import {
  useAppMutation,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type {
  AuthRegisterRequestDto,
  AuthRegisterResponseDto,
} from '@/features/auth/types/auth.dto';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useRegisterMutation = (
  options?: Partial<UseAppMutationOptions<AuthRegisterResponseDto, Error, AuthRegisterRequestDto>>
) => {
  return useAppMutation<AuthRegisterResponseDto, Error, AuthRegisterRequestDto>({
    mutationFn: (payload: AuthRegisterRequestDto) => authApi.register(payload),
    successCode: AUTH_SUCCESS_CODES.REGISTERED,
    ...options,
  });
};

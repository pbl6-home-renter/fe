import {
  useAppMutation,
  type UseAppMutationOptions,
} from '@/lib/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type { UserChangePasswordRequestDto } from '@/features/auth/types/auth.dto';
import { AUTH_SUCCESS_CODES } from '@/lib/api-code-i18n';

export const useChangePasswordMutation = (
  options?: Partial<UseAppMutationOptions<void, Error, UserChangePasswordRequestDto>>
) => {
  return useAppMutation<void, Error, UserChangePasswordRequestDto>({
    mutationFn: (payload: UserChangePasswordRequestDto) => authApi.changePassword(payload),
    successCode: AUTH_SUCCESS_CODES.PASSWORD_CHANGED,
    ...options,
  });
};

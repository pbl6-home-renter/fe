import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../api/auth.api';
import type { AuthLoginRequestDto, AuthLoginResponseDto } from '../types/auth.dto';

export const useLoginMutation = (
  options?: MutationHookOptions<AuthLoginResponseDto, AuthLoginRequestDto>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    ...options,
    onSuccess: (data, ...rest) => {
      const user = data.user || data.profile;
      if (user) {
        setAuth(user, data.accessToken, data.refreshToken);
      }
      return options?.onSuccess?.(data, ...rest);
    },
  });
};

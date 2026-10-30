import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type { AuthResetPasswordRequestDto } from '../types/auth.dto';

export const useResetPasswordMutation = (
  options?: MutationHookOptions<void, AuthResetPasswordRequestDto>
) =>
  useMutation({ mutationFn: authApi.resetPassword, ...options });

import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type { UserChangePasswordRequestDto } from '../types/auth.dto';

export const useChangePasswordMutation = (
  options?: MutationHookOptions<void, UserChangePasswordRequestDto>
) =>
  useMutation({ mutationFn: authApi.changePassword, ...options });

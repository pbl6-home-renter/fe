import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type { AuthVerifyEmailRequestDto } from '../types/auth.dto';

export const useVerifyEmailMutation = (options?: MutationHookOptions<void, AuthVerifyEmailRequestDto>) =>
  useMutation({ mutationFn: authApi.verifyEmail, ...options });

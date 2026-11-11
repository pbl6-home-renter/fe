import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type { AuthRequestEmailVerificationRequestDto } from '../types/auth.dto';

export const useRequestEmailVerificationMutation = (
  options?: MutationHookOptions<{ accepted: boolean }, AuthRequestEmailVerificationRequestDto>,
) => useMutation({ mutationFn: authApi.requestEmailVerification, ...options });

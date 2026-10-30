import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type {
  AuthRequestPasswordResetRequestDto,
  AuthRequestPasswordResetResponseDto,
} from '../types/auth.dto';

export const useRequestPasswordResetMutation = (
  options?: MutationHookOptions<
    AuthRequestPasswordResetResponseDto,
    AuthRequestPasswordResetRequestDto
  >
) =>
  useMutation({ mutationFn: authApi.requestPasswordReset, ...options });

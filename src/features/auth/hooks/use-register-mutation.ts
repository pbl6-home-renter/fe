import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { authApi } from '../api/auth.api';
import type { AuthRegisterRequestDto, AuthRegisterResponseDto } from '../types/auth.dto';

export const useRegisterMutation = (
  options?: MutationHookOptions<AuthRegisterResponseDto, AuthRegisterRequestDto>
) =>
  useMutation({ mutationFn: authApi.register, ...options });

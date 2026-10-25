import { apiClient } from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';
import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthLogoutRequestDto,
  AuthRegisterRequestDto,
  AuthRegisterResponseDto,
  AuthRequestPasswordResetRequestDto,
  AuthRequestPasswordResetResponseDto,
  AuthResetPasswordRequestDto,
  UserChangePasswordRequestDto,
  UserProfile,
} from '../types/auth.dto';

export const authApi = {
  login: async (credentials: AuthLoginRequestDto): Promise<AuthLoginResponseDto> => {
    return apiClient.post<ApiResponse<AuthLoginResponseDto>, AuthLoginResponseDto>(
      '/auth/login',
      credentials
    );
  },

  register: async (payload: AuthRegisterRequestDto): Promise<AuthRegisterResponseDto> => {
    return apiClient.post<ApiResponse<AuthRegisterResponseDto>, AuthRegisterResponseDto>(
      '/auth/register',
      payload
    );
  },

  logout: async (payload?: AuthLogoutRequestDto): Promise<void> => {
    const refreshToken =
      payload?.refreshToken ?? useAuthStore.getState().refreshToken ?? '';
    return apiClient.post<void, void>('/auth/logout', { refreshToken });
  },

  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<ApiResponse<UserProfile>, UserProfile>('/me');
  },

  requestPasswordReset: async (
    payload: AuthRequestPasswordResetRequestDto
  ): Promise<AuthRequestPasswordResetResponseDto> => {
    return apiClient.post<
      ApiResponse<AuthRequestPasswordResetResponseDto>,
      AuthRequestPasswordResetResponseDto
    >('/auth/password-reset-requests', payload);
  },

  resetPassword: async (payload: AuthResetPasswordRequestDto): Promise<void> => {
    return apiClient.post<void, void>('/auth/password-resets', payload);
  },

  changePassword: async (payload: UserChangePasswordRequestDto): Promise<void> => {
    return apiClient.put<void, void>('/me/password', payload);
  },
};

import { http } from '@/lib/api/http';
import { useAuthStore } from '@/stores/auth-store';
import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthLogoutRequestDto,
  AuthRegisterRequestDto,
  AuthRegisterResponseDto,
  AuthVerifyEmailRequestDto,
  AuthRequestEmailVerificationRequestDto,
  AuthRequestPasswordResetRequestDto,
  AuthRequestPasswordResetResponseDto,
  AuthResetPasswordRequestDto,
  UserChangePasswordRequestDto,
  UserProfile,
} from '../types/auth.dto';

export const authApi = {
  login: (body: AuthLoginRequestDto) => http.post<AuthLoginResponseDto>('/auth/login', body),

  register: (body: AuthRegisterRequestDto) => http.post<AuthRegisterResponseDto>('/auth/register', body),

  verifyEmail: (body: AuthVerifyEmailRequestDto) => http.post('/auth/email-verifications', body),

  requestEmailVerification: (body: AuthRequestEmailVerificationRequestDto) =>
    http.post<{ accepted: boolean }>('/auth/email-verification-requests', body),

  logout: (body?: AuthLogoutRequestDto) =>
    http.post('/auth/logout', {
      refreshToken: body?.refreshToken ?? useAuthStore.getState().refreshToken ?? '',
    }),

  getProfile: () => http.get<UserProfile>('/me'),

  requestPasswordReset: (body: AuthRequestPasswordResetRequestDto) =>
    http.post<AuthRequestPasswordResetResponseDto>('/auth/password-reset-requests', body, { skipSuccessToast: true }),

  resetPassword: (body: AuthResetPasswordRequestDto) => http.post('/auth/password-resets', body),

  changePassword: (body: UserChangePasswordRequestDto) => http.put('/me/password', body),
};

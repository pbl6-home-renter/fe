import { http } from '@/lib/api/http';
import { useAuthStore } from '@/stores/auth-store';
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

/** Called only from forms, which show the error inline instead of a toast. */
const FORM_REQUEST = { skipErrorToast: true };

export const authApi = {
  login: (body: AuthLoginRequestDto) =>
    http.post<AuthLoginResponseDto>('/auth/login', body, FORM_REQUEST),

  register: (body: AuthRegisterRequestDto) =>
    http.post<AuthRegisterResponseDto>('/auth/register', body, FORM_REQUEST),

  logout: (body?: AuthLogoutRequestDto) =>
    http.post('/auth/logout', {
      refreshToken: body?.refreshToken ?? useAuthStore.getState().refreshToken ?? '',
    }),

  getProfile: () => http.get<UserProfile>('/me'),

  requestPasswordReset: (body: AuthRequestPasswordResetRequestDto) =>
    http.post<AuthRequestPasswordResetResponseDto>(
      '/auth/password-reset-requests',
      body,
      FORM_REQUEST
    ),

  resetPassword: (body: AuthResetPasswordRequestDto) =>
    http.post('/auth/password-resets', body, FORM_REQUEST),

  changePassword: (body: UserChangePasswordRequestDto) =>
    http.put('/me/password', body, FORM_REQUEST),
};

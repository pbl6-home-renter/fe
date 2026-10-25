import type { User } from '@/types/user';

export type UserProfile = User;

export interface AuthLoginRequestDto {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthSessionResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  profile?: UserProfile;
}

export type AuthLoginResponseDto = AuthSessionResponseDto;

export interface AuthRegisterRequestDto {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'tenant' | 'landlord';
}

export type AuthRegisterResponseDto = AuthSessionResponseDto;

export interface AuthRefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthLogoutRequestDto {
  refreshToken: string;
}

export interface AuthRequestPasswordResetRequestDto {
  email: string;
}

export interface AuthRequestPasswordResetResponseDto {
  accepted: boolean;
}

export interface AuthResetPasswordRequestDto {
  token: string;
  newPassword: string;
}

export interface UserChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

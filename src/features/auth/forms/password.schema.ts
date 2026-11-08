import { z } from 'zod';
import { AUTH_VALIDATION_KEYS } from '../constants/auth.constants';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, AUTH_VALIDATION_KEYS.EMAIL_REQUIRED)
    .email(AUTH_VALIDATION_KEYS.EMAIL_INVALID)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, AUTH_VALIDATION_KEYS.EMAIL_INVALID)
    .min(5)
    .max(254),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, AUTH_VALIDATION_KEYS.TOKEN_REQUIRED),
    newPassword: z
      .string()
      .min(1, AUTH_VALIDATION_KEYS.PASSWORD_REQUIRED)
      .min(8, AUTH_VALIDATION_KEYS.PASSWORD_MIN)
      .regex(/[a-z]/, AUTH_VALIDATION_KEYS.PASSWORD_LOWERCASE)
      .regex(/[A-Z]/, AUTH_VALIDATION_KEYS.PASSWORD_UPPERCASE)
      .regex(/[0-9]/, AUTH_VALIDATION_KEYS.PASSWORD_NUMBER),
    confirmPassword: z.string().min(1, AUTH_VALIDATION_KEYS.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: AUTH_VALIDATION_KEYS.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, AUTH_VALIDATION_KEYS.CURRENT_PASSWORD_REQUIRED),
    newPassword: z
      .string()
      .min(1, AUTH_VALIDATION_KEYS.PASSWORD_REQUIRED)
      .min(8, AUTH_VALIDATION_KEYS.PASSWORD_MIN)
      .regex(/[a-z]/, AUTH_VALIDATION_KEYS.PASSWORD_LOWERCASE)
      .regex(/[A-Z]/, AUTH_VALIDATION_KEYS.PASSWORD_UPPERCASE)
      .regex(/[0-9]/, AUTH_VALIDATION_KEYS.PASSWORD_NUMBER),
    confirmPassword: z.string().min(1, AUTH_VALIDATION_KEYS.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: AUTH_VALIDATION_KEYS.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

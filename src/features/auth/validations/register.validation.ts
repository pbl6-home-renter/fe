import { z } from 'zod';
import { Role } from '@/types/role';
import { AUTH_VALIDATION_KEYS } from './common.validation';

export type RegisterRole = typeof Role.TENANT | typeof Role.LANDLORD;

export const registerSchema = z
  .object({
    role: z.enum([Role.TENANT, Role.LANDLORD] as const),
    name: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.NAME_REQUIRED)
      .min(2, AUTH_VALIDATION_KEYS.NAME_MIN)
      .max(254),
    phone: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.PHONE_REQUIRED)
      .regex(/^0[0-9]{9}$|^\+84[0-9]{9}$/, AUTH_VALIDATION_KEYS.PHONE_INVALID),
    email: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.EMAIL_REQUIRED)
      .email(AUTH_VALIDATION_KEYS.EMAIL_INVALID)
      .min(5)
      .max(254),
    password: z
      .string()
      .min(1, AUTH_VALIDATION_KEYS.PASSWORD_REQUIRED)
      .min(6, AUTH_VALIDATION_KEYS.PASSWORD_MIN),
    confirmPassword: z
      .string()
      .min(1, AUTH_VALIDATION_KEYS.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_VALIDATION_KEYS.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthRegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: RegisterRole;
}

export const toRegisterPayload = (data: RegisterFormData): AuthRegisterPayload => {
  return {
    name: data.name,
    phone: data.phone,
    email: data.email,
    password: data.password,
    role: data.role,
  };
};

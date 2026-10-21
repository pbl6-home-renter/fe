import { z } from 'zod';
import { Role } from '@/types/role';

/**
 * Valid roles allowed for registration
 */
export type RegisterRole = typeof Role.TENANT | typeof Role.LANDLORD;

/**
 * Standard Auth i18n Translation Keys for Validation Errors
 */
export const AUTH_VALIDATION_KEYS = {
  FULLNAME_REQUIRED: 'errors.fullnameRequired',
  FULLNAME_MIN: 'errors.fullnameMin',
  PHONE_REQUIRED: 'errors.phoneRequired',
  PHONE_INVALID: 'errors.phoneInvalid',
  EMAIL_REQUIRED: 'errors.emailRequired',
  EMAIL_INVALID: 'errors.invalidEmail',
  PASSWORD_REQUIRED: 'errors.passwordRequired',
  PASSWORD_MIN: 'errors.passwordMinLength',
  CONFIRM_PASSWORD_REQUIRED: 'errors.confirmPasswordRequired',
  PASSWORD_MISMATCH: 'errors.passwordMismatch',
  ROLE_REQUIRED: 'errors.roleRequired',
} as const;

export type AuthErrorKey = (typeof AUTH_VALIDATION_KEYS)[keyof typeof AUTH_VALIDATION_KEYS];

/**
 * Zod Schema for User Login (Returns i18n error keys)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, AUTH_VALIDATION_KEYS.EMAIL_REQUIRED)
    .email(AUTH_VALIDATION_KEYS.EMAIL_INVALID),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_KEYS.PASSWORD_REQUIRED),
});

/**
 * Inferred TypeScript Type for Login Form
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Zod Schema for User Registration (Returns i18n error keys)
 */
export const registerSchema = z
  .object({
    role: z.enum([Role.TENANT, Role.LANDLORD] as const),
    fullname: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.FULLNAME_REQUIRED)
      .min(2, AUTH_VALIDATION_KEYS.FULLNAME_MIN),
    phone: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.PHONE_REQUIRED)
      .regex(/^(0|\+84)[0-9]{9,10}$/, AUTH_VALIDATION_KEYS.PHONE_INVALID),
    email: z
      .string()
      .trim()
      .min(1, AUTH_VALIDATION_KEYS.EMAIL_REQUIRED)
      .email(AUTH_VALIDATION_KEYS.EMAIL_INVALID),
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

/**
 * Inferred TypeScript Type for Register Form
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Standard Validation Output Envelope
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Validate Login Form Data using loginSchema
 */
export const validateLoginForm = (data: unknown): ValidationResult<LoginFormData> => {
  const result = loginSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key && !errors[String(key)]) {
      errors[String(key)] = issue.message;
    }
  });

  return { success: false, errors };
};

/**
 * Validate Register Form Data using registerSchema
 */
export const validateRegisterForm = (data: unknown): ValidationResult<RegisterFormData> => {
  const result = registerSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key && !errors[String(key)]) {
      errors[String(key)] = issue.message;
    }
  });

  return { success: false, errors };
};

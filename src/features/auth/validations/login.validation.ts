import { z } from 'zod';
import { AUTH_VALIDATION_KEYS } from './common.validation';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, AUTH_VALIDATION_KEYS.IDENTIFIER_REQUIRED),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_KEYS.PASSWORD_REQUIRED),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

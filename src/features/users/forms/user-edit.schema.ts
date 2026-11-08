import { z } from 'zod';

export const userEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'validations.nameRequired')
    .min(2, 'validations.nameMin')
    .max(254, 'validations.nameMax'),
  phone: z
    .string()
    .trim()
    .min(1, 'validations.phoneRequired')
    .regex(/^(0[0-9]{9}|\+84[0-9]{9})$/, 'validations.phoneInvalid'),
});

export type UserEditFormData = z.infer<typeof userEditSchema>;

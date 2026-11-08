import { z } from 'zod';

const VIETNAMESE_PHONE_REGEX = /^(0[0-9]{9}|\+84[0-9]{9})$/;
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const addMemberSchema = z.object({
  tenantName: z.string().trim().min(1, 'errors.tenantNameRequired').max(254, 'errors.tenantNameTooLong'),
  tenantPhone: z.string().trim().regex(VIETNAMESE_PHONE_REGEX, 'errors.phoneInvalid'),
  joinedAt: z.string().trim().regex(DATE_REGEX, 'errors.joinedAtRequired'),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export const leaveMemberSchema = z.object({
  leftOn: z.string().trim().regex(DATE_REGEX, 'errors.leftOnRequired'),
});

export type LeaveMemberFormValues = z.infer<typeof leaveMemberSchema>;

export const checkoutSchema = z.object({
  completedOn: z.string().trim().regex(DATE_REGEX, 'errors.completedOnRequired'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

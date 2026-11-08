import { z } from 'zod';

export const userLockSchema = z.object({
  lockReason: z.string().trim().min(1, 'validations.lockReasonRequired').max(500, 'validations.lockReasonMax'),
});

export type UserLockFormData = z.infer<typeof userLockSchema>;

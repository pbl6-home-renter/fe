import { z } from 'zod';

export const invoiceCancelSchema = z.object({
  reason: z.string().trim().min(1, 'validations.cancelReasonRequired').max(500, 'validations.cancelReasonMax'),
});

export type InvoiceCancelFormData = z.infer<typeof invoiceCancelSchema>;

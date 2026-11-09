import { z } from 'zod';

export const billingSettingFormSchema = z.object({
  paymentDueDay: z.number().int().min(1).max(28),
  remindDay: z.number().int().min(1).max(28).nullable().optional(),
  botEnabled: z.boolean(),
});

export type BillingSettingFormData = z.infer<typeof billingSettingFormSchema>;

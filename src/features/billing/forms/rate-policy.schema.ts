import { z } from 'zod';
import { RATE_PRICE_REGEX } from '../constants/billing.constants';

export const rateStepSchema = z.object({
  from: z.number().int().min(0),
  to: z.number().int().min(0).nullable(),
  price: z.string().regex(RATE_PRICE_REGEX),
});

export const rateItemSchema = z
  .object({
    type: z.enum(['electricity', 'water', 'wifi', 'cleaning', 'parking', 'maintenance', 'other']),
    name: z.string().trim().min(1).max(100),
    rateKind: z.enum(['flat', 'tiered', 'fixed_per_period', 'per_head', 'per_area_m2', 'per_vehicle']),
    unitPrice: z.string().optional().nullable(),
    steps: z.array(rateStepSchema).optional().nullable(),
    billingUnit: z.enum(['kwh', 'm3', 'room', 'person', 'm2', 'vehicle', 'day', 'occurrence']),
  })
  .refine(
    (item) => {
      if (item.rateKind === 'tiered') {
        return Array.isArray(item.steps) && item.steps.length > 0;
      }
      return typeof item.unitPrice === 'string' && RATE_PRICE_REGEX.test(item.unitPrice);
    },
    {
      message: 'invalidRateItemConfig',
      path: ['unitPrice'],
    },
  );

export const ratePolicyFormSchema = z.object({
  rates: z.array(rateItemSchema).min(1),
});

export type RateItemFormData = z.infer<typeof rateItemSchema>;
export type RatePolicyFormData = z.infer<typeof ratePolicyFormSchema>;

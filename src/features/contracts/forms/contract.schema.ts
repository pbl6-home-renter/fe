import { z } from 'zod';

export const contractCreateSchema = z
  .object({
    buildingId: z.string().min(1, 'validations.buildingRequired'),
    roomId: z.string().min(1, 'validations.roomRequired'),
    tenantName: z
      .string()
      .trim()
      .min(1, 'validations.tenantNameRequired')
      .max(254, 'validations.tenantNameMax'),
    tenantPhone: z
      .string()
      .trim()
      .min(1, 'validations.tenantPhoneRequired')
      .regex(/^(0[0-9]{9}|\+84[0-9]{9})$/, 'validations.tenantPhoneInvalid'),
    rentPrice: z
      .number()
      .min(0, 'validations.rentPriceMin'),
    depositAmount: z
      .number()
      .min(0, 'validations.depositAmountMin'),
    startDate: z.string().min(1, 'validations.startDateRequired'),
    endDate: z.string().min(1, 'validations.endDateRequired'),
    vehicleCount: z
      .number()
      .int()
      .min(0, 'validations.vehicleCountMin')
      .nullable()
      .optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate > data.startDate, {
    message: 'validations.endDateAfterStart',
    path: ['endDate'],
  });

export type ContractCreateFormData = z.infer<typeof contractCreateSchema>;

export const contractEditSchema = z.object({
  vehicleCount: z
    .number()
    .int()
    .min(0, 'validations.vehicleCountMin')
    .nullable()
    .optional(),
  description: z
    .string()
    .max(500, 'validations.descriptionMax')
    .nullable()
    .optional(),
});

export type ContractEditFormData = z.infer<typeof contractEditSchema>;

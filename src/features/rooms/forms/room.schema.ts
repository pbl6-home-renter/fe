import { z } from 'zod';
import { GenderPolicy } from '../enums/gender-policy.enum';

export const roomCreateSchema = z.object({
  buildingId: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'errors.nameRequired')
    .max(254, 'errors.nameMax'),
  floorNumber: z
    .number()
    .int('errors.floorNumberInt')
    .min(1, 'errors.floorNumberMin'),
  area: z
    .string()
    .trim()
    .min(1, 'errors.areaRequired')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'errors.areaPositive',
    }),
  rentPrice: z
    .number()
    .min(0, 'errors.rentPriceMin'),
  depositAmount: z
    .number()
    .min(0, 'errors.depositAmountMin'),
  genderPolicy: z.enum([GenderPolicy.ANY, GenderPolicy.MALE, GenderPolicy.FEMALE]),
  maxOccupancy: z
    .number()
    .int('errors.maxOccupancyInt')
    .min(1, 'errors.maxOccupancyMin')
    .optional()
    .nullable(),
  amenities: z
    .object({
      aircon: z.boolean().optional(),
      fridge: z.boolean().optional(),
      wcInside: z.boolean().optional(),
      waterHeater: z.boolean().optional(),
      mezzanine: z.boolean().optional(),
      table: z.boolean().optional(),
      chair: z.boolean().optional(),
    })
    .optional(),
});

export type RoomCreateFormData = z.infer<typeof roomCreateSchema>;

export const roomUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'errors.nameRequired')
    .max(254, 'errors.nameMax')
    .optional(),
  rentPrice: z
    .number()
    .min(0, 'errors.rentPriceMin')
    .optional(),
  area: z
    .string()
    .trim()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'errors.areaPositive',
    })
    .optional()
    .nullable(),
});

export type RoomUpdateFormData = z.infer<typeof roomUpdateSchema>;

import { z } from 'zod';
import { BUILDING_VALIDATION_KEYS } from '../constants/building.constants';

export const buildingInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.NAME_REQUIRED)
    .max(254, BUILDING_VALIDATION_KEYS.NAME_MAX),
  province: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.PROVINCE_REQUIRED)
    .max(100, BUILDING_VALIDATION_KEYS.PROVINCE_MAX),
  ward: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.WARD_REQUIRED)
    .max(100, BUILDING_VALIDATION_KEYS.WARD_MAX),
  address: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.ADDRESS_REQUIRED)
    .max(254, BUILDING_VALIDATION_KEYS.ADDRESS_MAX),
  totalFloors: z
    .number()
    .int()
    .min(1, BUILDING_VALIDATION_KEYS.TOTAL_FLOORS_MIN)
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(1000, BUILDING_VALIDATION_KEYS.DESCRIPTION_MAX)
    .optional()
    .nullable(),
  amenities: z
    .object({
      elevator: z.boolean().optional(),
      parking: z.boolean().optional(),
      securityCamera: z.boolean().optional(),
      fingerprintLock: z.boolean().optional(),
    })
    .optional(),
});

export type BuildingInfoFormData = z.infer<typeof buildingInfoSchema>;

export const buildingUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.NAME_REQUIRED)
    .max(254, BUILDING_VALIDATION_KEYS.NAME_MAX)
    .optional(),
  address: z
    .string()
    .trim()
    .min(1, BUILDING_VALIDATION_KEYS.ADDRESS_REQUIRED)
    .max(254, BUILDING_VALIDATION_KEYS.ADDRESS_MAX)
    .optional(),
});

export type BuildingUpdateFormData = z.infer<typeof buildingUpdateSchema>;

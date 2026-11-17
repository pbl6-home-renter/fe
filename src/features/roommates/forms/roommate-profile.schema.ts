import { z } from 'zod';

export const roommateProfileSchema = z.object({
  isVisible: z.boolean(),
  bio: z.string().max(1000).nullable().optional(),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  birthYear: z.number().int().min(1950).max(new Date().getFullYear()).nullable().optional(),
  occupation: z.string().max(100).nullable().optional(),
  preferredProvince: z.string().max(100).nullable().optional(),
  preferredDistrict: z.string().max(100).nullable().optional(),
  preferredArea: z.string().max(255).nullable().optional(),
  budgetMin: z.number().int().min(0).nullable().optional(),
  budgetMax: z.number().int().min(0).nullable().optional(),
  moveInOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional()
    .or(z.literal('')),
  lifestyle: z
    .object({
      cleanAndTidy: z.boolean().optional(),
      earlyBird: z.boolean().optional(),
      nightOwl: z.boolean().optional(),
      petFriendly: z.boolean().optional(),
      smoking: z.boolean().optional(),
      cooking: z.boolean().optional(),
      guestsAllowed: z.boolean().optional(),
    })
    .optional(),
});

export type RoommateProfileFormData = z.infer<typeof roommateProfileSchema>;

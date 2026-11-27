import { z } from 'zod';
import { REPORT_CATEGORY_VALUES, type ReportCategory } from '../enums/moderation.enum';
import { CONTACT_PHONE_REGEX, MODERATION_LIMITS } from '../constants/moderation.constants';

/** Zod messages are i18n keys in the `moderation` namespace, translated by `getFieldError`. */

const isBlankOr = (check: (value: string) => boolean) => (value: string) => value === '' || check(value);

export const appealSubmitSchema = z.object({
  content: z
    .string()
    .trim()
    .min(MODERATION_LIMITS.APPEAL_CONTENT_MIN, 'validations.contentMin')
    .max(MODERATION_LIMITS.APPEAL_CONTENT_MAX, 'validations.contentMax'),
  contactEmail: z
    .string()
    .trim()
    .refine(
      isBlankOr((value) => z.email().safeParse(value).success),
      'validations.emailInvalid',
    ),
  contactPhone: z
    .string()
    .trim()
    .refine(
      isBlankOr((value) => CONTACT_PHONE_REGEX.test(value)),
      'validations.phoneInvalid',
    ),
});

export type AppealSubmitFormData = z.infer<typeof appealSubmitSchema>;

export const reportSubmitSchema = z.object({
  category: z.enum(REPORT_CATEGORY_VALUES as [ReportCategory, ...ReportCategory[]], 'validations.categoryRequired'),
  description: z
    .string()
    .trim()
    .min(MODERATION_LIMITS.REPORT_DESCRIPTION_MIN, 'validations.descriptionMin')
    .max(MODERATION_LIMITS.REPORT_DESCRIPTION_MAX, 'validations.descriptionMax'),
});

export type ReportSubmitFormData = z.infer<typeof reportSubmitSchema>;

export const reasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'validations.reasonRequired')
    .max(MODERATION_LIMITS.REASON_MAX, 'validations.reasonMax'),
});

export type ReasonFormData = z.infer<typeof reasonSchema>;

/** Same shape as `reasonSchema`, for an optional note (dismissing a report). */
export const optionalReasonSchema = z.object({
  reason: z.string().trim().max(MODERATION_LIMITS.REASON_MAX, 'validations.reasonMax'),
});

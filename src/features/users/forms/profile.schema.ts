import { z } from 'zod';

const PHONE_REGEX = /^(0[0-9]{9}|\+84[0-9]{9})$/;
const ACCOUNT_NUMBER_REGEX = /^[0-9]{6,20}$/;

const optionalTrimmedString = z.string().trim();

export const profileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'validations.nameRequired')
      .min(2, 'validations.nameMin')
      .max(254, 'validations.nameMax'),
    phone: z.string().trim().min(1, 'validations.phoneRequired').regex(PHONE_REGEX, 'validations.phoneInvalid'),
    bankCode: optionalTrimmedString,
    accountNumber: optionalTrimmedString,
    accountName: optionalTrimmedString,
  })
  .superRefine((data, ctx) => {
    const hasAnyPayoutField = Boolean(data.bankCode || data.accountNumber || data.accountName);
    if (!hasAnyPayoutField) return;

    if (!data.bankCode) {
      ctx.addIssue({ code: 'custom', path: ['bankCode'], message: 'validations.bankCodeRequired' });
    } else if (data.bankCode.length < 4 || data.bankCode.length > 20) {
      ctx.addIssue({ code: 'custom', path: ['bankCode'], message: 'validations.bankCodeLength' });
    }

    if (!data.accountNumber) {
      ctx.addIssue({ code: 'custom', path: ['accountNumber'], message: 'validations.accountNumberRequired' });
    } else if (!ACCOUNT_NUMBER_REGEX.test(data.accountNumber)) {
      ctx.addIssue({ code: 'custom', path: ['accountNumber'], message: 'validations.accountNumberInvalid' });
    }

    if (!data.accountName) {
      ctx.addIssue({ code: 'custom', path: ['accountName'], message: 'validations.accountNameRequired' });
    } else if (data.accountName.length > 254) {
      ctx.addIssue({ code: 'custom', path: ['accountName'], message: 'validations.accountNameMax' });
    }
  });

export type ProfileFormData = z.infer<typeof profileSchema>;

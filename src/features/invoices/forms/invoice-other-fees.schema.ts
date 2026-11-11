import { z } from 'zod';
import { INVOICE_MAX_OTHER_FEES } from '../constants/invoices.constants';

const INTEGER_NON_ZERO_REGEX = /^-?[1-9]\d*$/;

export const invoiceOtherFeeItemSchema = z.object({
  name: z.string().trim().min(1, 'validations.feeNameRequired').max(100, 'validations.feeNameMax'),
  amount: z
    .string()
    .trim()
    .min(1, 'validations.feeAmountRequired')
    .regex(INTEGER_NON_ZERO_REGEX, 'validations.feeAmountInvalid'),
});

export const invoiceOtherFeesSchema = z.object({
  otherFees: z.array(invoiceOtherFeeItemSchema).max(INVOICE_MAX_OTHER_FEES, 'validations.otherFeesMax'),
  note: z.string().trim().max(500, 'validations.noteMax'),
});

export type InvoiceOtherFeesFormData = z.infer<typeof invoiceOtherFeesSchema>;

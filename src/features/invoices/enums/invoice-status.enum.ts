export const InvoiceStatus = {
  PENDING: 'pending',
  ISSUED: 'issued',
  VOID: 'void',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const INVOICE_STATUS_VALUES: readonly string[] = Object.values(InvoiceStatus);

export const InvoiceBlockReason = {
  READING_MISSING: 'READING_MISSING',
  RATE_MISSING: 'RATE_MISSING',
  TIER_CONFIG_INVALID: 'TIER_CONFIG_INVALID',
  AREA_MISSING: 'AREA_MISSING',
  HEADCOUNT_ZERO: 'HEADCOUNT_ZERO',
  VEHICLE_COUNT_MISSING: 'VEHICLE_COUNT_MISSING',
  TOTAL_NEGATIVE: 'TOTAL_NEGATIVE',
} as const;

export type InvoiceBlockReason = (typeof InvoiceBlockReason)[keyof typeof InvoiceBlockReason];

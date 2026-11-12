import type { BaseEntity, ListParams } from '@/types/api';
import type { InvoiceBlockReason, InvoiceStatus } from '../enums/invoice-status.enum';

export type InvoiceSortField = 'period' | 'createdAt';

export type InvoiceRateType = 'electricity' | 'water' | 'wifi' | 'cleaning' | 'parking' | 'maintenance' | 'other';

export type InvoiceRateKind = 'flat' | 'tiered' | 'fixed_per_period' | 'per_head' | 'per_area_m2' | 'per_vehicle';

export type InvoiceBillingUnit = 'kwh' | 'm3' | 'room' | 'person' | 'm2' | 'vehicle' | 'day' | 'occurrence';

export interface InvoiceTierDetailDto {
  step: number;
  from: number;
  to: number | null;
  price: string;
  quantity: string;
  amount: string;
}

export interface InvoiceLineDto {
  type: InvoiceRateType;
  name: string;
  rateKind: InvoiceRateKind;
  unitPrice: string | null;
  quantity: string;
  unit: InvoiceBillingUnit;
  serviceStart: string;
  serviceEnd: string;
  prorateRatio: string;
  amount: string;
  tierDetail?: InvoiceTierDetailDto[];
}

export interface InvoiceOtherFeeDto {
  name: string;
  amount: string;
}

export interface InvoiceListFilter {
  buildingId?: string;
  roomId?: string;
  contractId?: string;
  period?: string;
  status?: InvoiceStatus;
}

export type InvoiceListParams = ListParams<InvoiceListFilter>;

export interface InvoiceListItemDto extends BaseEntity {
  code: string;
  contractId: string;
  roomId: string;
  roomName: string;
  tenantName: string | null;
  tenantPhone: string | null;
  period: string;
  totalAmount: string;
  invoiceStatus: InvoiceStatus;
  issuedAt: string | null;
}

export interface InvoiceDetailDto extends InvoiceListItemDto {
  rentAmount: string;
  breakdown: InvoiceLineDto[];
  otherFees: InvoiceOtherFeeDto[];
  voidedInvoiceId: string | null;
  voidReason: string | null;
  note: string | null;
}

export interface InvoiceGenerateRequestDto {
  buildingId: string;
  period: string;
}

export interface InvoiceGeneratedItemDto {
  invoiceId: string;
  code: string;
  contractId: string;
  roomId: string;
  totalAmount: string;
}

export interface InvoiceBlockedItemDto {
  roomId: string;
  contractId: string;
  reasonCode: InvoiceBlockReason | string;
}

export interface InvoiceGenerateResponseDto {
  buildingId: string;
  period: string;
  generated: InvoiceGeneratedItemDto[];
  recalculated: InvoiceGeneratedItemDto[];
  blocked: InvoiceBlockedItemDto[];
}

export interface InvoiceUpdateRequestDto {
  otherFees?: InvoiceOtherFeeDto[];
  note?: string | null;
}

export interface InvoiceUpdateResponseDto extends BaseEntity {
  otherFees: InvoiceOtherFeeDto[];
  note: string | null;
  totalAmount: string;
}

export interface InvoiceIssueRequestDto {
  invoiceIds: string[];
}

export interface InvoiceIssueSucceededDto extends BaseEntity {
  code: string;
  invoiceStatus: typeof InvoiceStatus.ISSUED;
  issuedAt: string;
}

export interface InvoiceIssueFailedDto {
  invoiceId: string;
  code: string;
}

export interface InvoiceIssueResponseDto {
  requested: number;
  succeeded: InvoiceIssueSucceededDto[];
  failed: InvoiceIssueFailedDto[];
}

export interface InvoiceCancelRequestDto {
  reason: string;
}

export interface InvoiceCancelResponseDto extends BaseEntity {
  invoiceStatus: typeof InvoiceStatus.VOID;
  voidReason: string;
}

export type TenantInvoiceSortField = 'period';

export interface TenantInvoiceListFilter {
  contractId?: string;
  period?: string;
}

export type TenantInvoiceListParams = ListParams<TenantInvoiceListFilter>;

export interface TenantInvoiceListItemDto {
  id: string;
  code: string;
  contractId: string;
  roomName: string;
  period: string;
  totalAmount: string;
  invoiceStatus: typeof InvoiceStatus.ISSUED;
  issuedAt: string;
}

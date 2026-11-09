import type { BaseEntity, PaginationParams } from '@/types/api';

export type RateType = 'electricity' | 'water' | 'wifi' | 'cleaning' | 'parking' | 'maintenance' | 'other';

export type RateKind = 'flat' | 'tiered' | 'fixed_per_period' | 'per_head' | 'per_area_m2' | 'per_vehicle';

export type BillingUnit = 'kwh' | 'm3' | 'room' | 'person' | 'm2' | 'vehicle' | 'day' | 'occurrence';

export interface RateStep {
  from: number;
  to: number | null;
  price: string;
}

export interface RateItem {
  type: RateType;
  name: string;
  rateKind: RateKind;
  unitPrice?: string | null;
  steps?: RateStep[] | null;
  billingUnit: BillingUnit;
}

export type RatePolicyScope = 'building' | 'room';

export interface RatePolicyDto extends BaseEntity {
  landlordId: string;
  scope: RatePolicyScope;
  buildingId: string | null;
  roomId: string | null;
  rates: RateItem[];
  isActive: boolean;
}

export interface RatePolicyListParams extends PaginationParams {
  'filter[scope]'?: RatePolicyScope;
  'filter[buildingId]'?: string;
  'filter[roomId]'?: string;
  'filter[type]'?: RateType;
}

export interface RatePolicyCreateRequestDto {
  scope: RatePolicyScope;
  buildingId?: string;
  roomId?: string;
  rates: RateItem[];
}

export interface RatePolicyUpdateRequestDto {
  rates?: RateItem[];
  isActive?: boolean;
}

export interface BuildingRatePoliciesBatchCreateRequestDto {
  rates: RateItem[];
}

export type BillingSettingScope = 'building' | 'room';

export interface BillingSettingDto extends BaseEntity {
  landlordId: string;
  scope: BillingSettingScope;
  buildingId: string;
  roomId: string | null;
  paymentDueDay: number;
  remindDay: number | null;
  botEnabled: boolean;
  isActive: boolean;
}

export interface BillingSettingListParams extends PaginationParams {
  'filter[scope]'?: BillingSettingScope;
  'filter[buildingId]'?: string;
  'filter[roomId]'?: string;
}

export interface BillingSettingCreateRequestDto {
  scope: BillingSettingScope;
  buildingId?: string;
  roomId?: string;
  paymentDueDay?: number;
  remindDay?: number | null;
  botEnabled?: boolean;
}

export interface BillingSettingUpdateRequestDto {
  paymentDueDay?: number;
  remindDay?: number | null;
  botEnabled?: boolean;
  isActive?: boolean;
}

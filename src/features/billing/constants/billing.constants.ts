import type {
  BillingSettingListParams,
  BillingUnit,
  RateKind,
  RatePolicyListParams,
  RateType,
} from '../types/billing.dto';

export const RATE_POLICY_QUERY_KEYS = {
  ALL: ['rate-policies'] as const,
  LIST: (params?: RatePolicyListParams) => [...RATE_POLICY_QUERY_KEYS.ALL, 'list', params] as const,
  BY_BUILDING: (buildingId: string) => [...RATE_POLICY_QUERY_KEYS.ALL, 'building', buildingId] as const,
  BY_ROOM: (roomId: string) => [...RATE_POLICY_QUERY_KEYS.ALL, 'room', roomId] as const,
};

export const BILLING_SETTING_QUERY_KEYS = {
  ALL: ['billing-settings'] as const,
  LIST: (params?: BillingSettingListParams) => [...BILLING_SETTING_QUERY_KEYS.ALL, 'list', params] as const,
  BY_BUILDING: (buildingId: string) => [...BILLING_SETTING_QUERY_KEYS.ALL, 'building', buildingId] as const,
  BY_ROOM: (roomId: string) => [...BILLING_SETTING_QUERY_KEYS.ALL, 'room', roomId] as const,
};

export const RATE_TYPES: readonly RateType[] = [
  'electricity',
  'water',
  'wifi',
  'cleaning',
  'parking',
  'maintenance',
  'other',
] as const;

export const RATE_KINDS: readonly RateKind[] = [
  'flat',
  'tiered',
  'fixed_per_period',
  'per_head',
  'per_area_m2',
  'per_vehicle',
] as const;

export const BILLING_UNITS: readonly BillingUnit[] = [
  'kwh',
  'm3',
  'room',
  'person',
  'm2',
  'vehicle',
  'day',
  'occurrence',
] as const;

export const RATE_PRICE_REGEX = /^(0|[1-9][0-9]*)(\.[0-9]+)?$/;

export const DEFAULT_BILLING_SETTING = {
  paymentDueDay: 5,
  remindDay: 10,
  botEnabled: true,
} as const;

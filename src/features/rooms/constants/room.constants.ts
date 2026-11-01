import { RoomStatus } from '../enums/room-status.enum';
import { GenderPolicy } from '../enums/gender-policy.enum';
import type { RoomFilter } from '../types/room.dto';

export const ROOM_QUERY_KEYS = {
  ALL: ['rooms'] as const,
  MY_LIST: (params?: { filter?: RoomFilter; pageNo?: number; pageSize?: number }) =>
    ['rooms', 'my-list', params] as const,
  DETAIL: (id?: string) => ['rooms', 'detail', id] as const,
};

export const SUPPORTED_ROOM_AMENITIES = [
  'aircon',
  'fridge',
  'wcInside',
  'waterHeater',
  'mezzanine',
  'table',
  'chair',
] as const;

export type RoomStatusLabelKey =
  | 'status.available'
  | 'status.occupied'
  | 'status.maintenance'
  | 'status.cleaning'
  | 'status.pending_cleanup';

export type GenderPolicyLabelKey = 'gender.any' | 'gender.male' | 'gender.female';

export const GENDER_POLICY_OPTIONS: Array<{
  value: GenderPolicy;
  labelKey: GenderPolicyLabelKey;
}> = [
  { value: GenderPolicy.ANY, labelKey: 'gender.any' },
  { value: GenderPolicy.MALE, labelKey: 'gender.male' },
  { value: GenderPolicy.FEMALE, labelKey: 'gender.female' },
];

export const ROOM_STATUS_CONFIG: Record<
  RoomStatus,
  { labelKey: RoomStatusLabelKey; dotClass: string; badgeVariant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [RoomStatus.AVAILABLE]: {
    labelKey: 'status.available',
    dotClass: 'bg-rentify-primary',
    badgeVariant: 'secondary',
  },
  [RoomStatus.OCCUPIED]: {
    labelKey: 'status.occupied',
    dotClass: 'bg-rentify-success',
    badgeVariant: 'success',
  },
  [RoomStatus.MAINTENANCE]: {
    labelKey: 'status.maintenance',
    dotClass: 'bg-rentify-error',
    badgeVariant: 'destructive',
  },
  [RoomStatus.CLEANING]: {
    labelKey: 'status.cleaning',
    dotClass: 'bg-rentify-warning',
    badgeVariant: 'warning',
  },
  [RoomStatus.PENDING_CLEANUP]: {
    labelKey: 'status.pending_cleanup',
    dotClass: 'bg-rentify-neutral',
    badgeVariant: 'outline',
  },
};

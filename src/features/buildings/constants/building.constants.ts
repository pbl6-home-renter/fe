import type { ListParams } from '@/types/api';
import type { BuildingFilter, BuildingAdminFilter } from '../types/building.dto';

export const BUILDING_QUERY_KEYS = {
  ALL: ['buildings'] as const,
  MY_LIST: (params?: ListParams<BuildingFilter>) => ['buildings', 'my-list', params] as const,
  MY_DETAIL: (id: string) => ['buildings', 'my-detail', id] as const,
  ADMIN_LIST: (params?: ListParams<BuildingAdminFilter>) => ['buildings', 'admin-list', params] as const,
  ADMIN_DETAIL: (id: string) => ['buildings', 'admin-detail', id] as const,
} as const;

/** Zod messages: i18n keys in the `buildings` namespace, translated by `getFieldError`. */
export const BUILDING_VALIDATION_KEYS = {
  NAME_REQUIRED: 'errors.nameRequired',
  NAME_MAX: 'errors.nameMax',
  PROVINCE_REQUIRED: 'errors.provinceRequired',
  PROVINCE_MAX: 'errors.provinceMax',
  WARD_REQUIRED: 'errors.wardRequired',
  WARD_MAX: 'errors.wardMax',
  ADDRESS_REQUIRED: 'errors.addressRequired',
  ADDRESS_MAX: 'errors.addressMax',
  TOTAL_FLOORS_MIN: 'errors.totalFloorsMin',
  DESCRIPTION_MAX: 'errors.descriptionMax',
  DOCUMENTS_REQUIRED: 'errors.documentsRequired',
} as const;

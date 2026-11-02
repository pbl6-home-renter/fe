import { ContractStatus } from '../enums/contract-status.enum';
import type { ListParams } from '@/types/api';
import type { ContractFilter } from '../types/contract.dto';

export const CONTRACT_QUERY_KEYS = {
  ALL: ['contracts'] as const,
  LIST: (params?: ListParams<ContractFilter>) => ['contracts', 'list', params] as const,
  DETAIL: (id?: string) => ['contracts', 'detail', id] as const,
  TEMPLATES: (params?: unknown) => ['contracts', 'templates', params] as const,
  TEMPLATE_DETAIL: (key?: string) => ['contracts', 'templates', key] as const,
};

export type ContractStatusLabelKey =
  | 'status.draft'
  | 'status.signed'
  | 'status.active'
  | 'status.suspended'
  | 'status.expired'
  | 'status.terminated';

export const CONTRACT_STATUS_CONFIG: Record<
  ContractStatus,
  {
    labelKey: ContractStatusLabelKey;
    dotClass: string;
    pillClass: string;
  }
> = {
  [ContractStatus.DRAFT]: {
    labelKey: 'status.draft',
    dotClass: 'bg-rentify-outline',
    pillClass: 'bg-rentify-surface-container-low text-rentify-text-secondary border-rentify-outline/30',
  },
  [ContractStatus.SIGNED]: {
    labelKey: 'status.signed',
    dotClass: 'bg-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [ContractStatus.ACTIVE]: {
    labelKey: 'status.active',
    dotClass: 'bg-emerald-500',
    pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [ContractStatus.SUSPENDED]: {
    labelKey: 'status.suspended',
    dotClass: 'bg-amber-500',
    pillClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  [ContractStatus.EXPIRED]: {
    labelKey: 'status.expired',
    dotClass: 'bg-gray-400',
    pillClass: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  [ContractStatus.TERMINATED]: {
    labelKey: 'status.terminated',
    dotClass: 'bg-rose-400',
    pillClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

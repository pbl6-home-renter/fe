import { ContractStatus } from '../enums/contract-status.enum';
import type { ListParams } from '@/types/api';
import type { ContractFilter, MyContractFilter } from '../types/contract.dto';

export const CONTRACT_QUERY_KEYS = {
  ALL: ['contracts'] as const,
  LIST: (params?: ListParams<ContractFilter>) => ['contracts', 'list', params] as const,
  MY_LIST: (params?: ListParams<MyContractFilter>) => ['contracts', 'me', params] as const,
  DETAIL: (id?: string) => ['contracts', 'detail', id] as const,
  TEMPLATES: (params?: unknown) => ['contracts', 'templates', params] as const,
  TEMPLATE_DETAIL: (key?: string) => ['contracts', 'templates', key] as const,
  MEMBERS: (contractId: string, params?: ListParams) =>
    params ? (['contracts', 'members', contractId, params] as const) : (['contracts', 'members', contractId] as const),
};

export type ContractStatusLabelKey =
  'status.draft' | 'status.signed' | 'status.active' | 'status.suspended' | 'status.expired' | 'status.terminated';

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
    dotClass: 'bg-rentify-primary',
    pillClass: 'bg-rentify-primary-container text-rentify-primary border-rentify-primary/20',
  },
  [ContractStatus.ACTIVE]: {
    labelKey: 'status.active',
    dotClass: 'bg-rentify-success',
    pillClass: 'bg-rentify-success/10 text-rentify-success border-rentify-success/20',
  },
  [ContractStatus.SUSPENDED]: {
    labelKey: 'status.suspended',
    dotClass: 'bg-rentify-warning',
    pillClass: 'bg-rentify-warning/10 text-rentify-warning border-rentify-warning/20',
  },
  [ContractStatus.EXPIRED]: {
    labelKey: 'status.expired',
    dotClass: 'bg-rentify-neutral',
    pillClass: 'bg-rentify-neutral/10 text-rentify-text-secondary border-rentify-neutral/20',
  },
  [ContractStatus.TERMINATED]: {
    labelKey: 'status.terminated',
    dotClass: 'bg-rentify-error',
    pillClass: 'bg-rentify-error/10 text-rentify-error border-rentify-error/20',
  },
};

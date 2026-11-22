import type { ListParams } from '@/types/api';
import type { ContractTenantListFilter } from '../types/tenant.dto';

export const TENANT_QUERY_KEYS = {
  ALL: ['contracts', 'tenants'] as const,
  LIST: (params?: ListParams<ContractTenantListFilter>) => ['contracts', 'tenants', 'list', params] as const,
  DETAIL: (id?: string) => ['contracts', 'tenants', 'detail', id] as const,
};

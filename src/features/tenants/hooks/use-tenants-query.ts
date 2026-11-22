import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api/tenant.api';
import { TENANT_QUERY_KEYS } from '../constants/tenant.constants';
import type { ContractTenantListFilter, ContractTenantListItemDto } from '../types/tenant.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const useTenantsQuery = (
  params?: ListParams<ContractTenantListFilter>,
  options?: QueryHookOptions<Paginated<ContractTenantListItemDto>>,
) =>
  useQuery({
    queryKey: TENANT_QUERY_KEYS.LIST(params),
    queryFn: () => tenantApi.getTenants(params),
    placeholderData: keepPreviousData,
    ...options,
  });

import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api/tenant.api';
import { TENANT_QUERY_KEYS } from '../constants/tenant.constants';
import type { ContractTenantDetailDto } from '../types/tenant.dto';
import type { QueryHookOptions } from '@/lib/query/types';

export const useTenantQuery = (contractMemberId: string, options?: QueryHookOptions<ContractTenantDetailDto>) =>
  useQuery({
    queryKey: TENANT_QUERY_KEYS.DETAIL(contractMemberId),
    queryFn: () => tenantApi.getTenantById(contractMemberId),
    enabled: Boolean(contractMemberId),
    ...options,
  });

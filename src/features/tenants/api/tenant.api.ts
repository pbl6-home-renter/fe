import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type { ContractTenantDetailDto, ContractTenantListFilter, ContractTenantListItemDto } from '../types/tenant.dto';

export const tenantApi = {
  getTenants: async (params?: ListParams<ContractTenantListFilter>): Promise<Paginated<ContractTenantListItemDto>> => {
    // If scope is explicitly 'current' or 'history'
    if (params?.filter?.scope === 'current' || params?.filter?.scope === 'history') {
      return http.getPage<ContractTenantListItemDto, ContractTenantListFilter>('/contracts/tenants', params);
    }

    // When scope is 'all' or omitted, query both current and history to combine results (as required by acceptance criteria)
    const [currentRes, historyRes] = await Promise.all([
      http.getPage<ContractTenantListItemDto, ContractTenantListFilter>('/contracts/tenants', {
        ...params,
        filter: { scope: 'current' },
      }),
      http.getPage<ContractTenantListItemDto, ContractTenantListFilter>('/contracts/tenants', {
        ...params,
        filter: { scope: 'history' },
      }),
    ]);

    const combined = [...currentRes.items, ...historyRes.items];
    const isDesc = params?.order === 'desc';
    combined.sort((a, b) => {
      const nameA = a.tenantName || '';
      const nameB = b.tenantName || '';
      return isDesc ? nameB.localeCompare(nameA, 'vi') : nameA.localeCompare(nameB, 'vi');
    });

    const pageNo = params?.pageNo ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedItems = combined.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      pagination: {
        type: 'offset',
        pageNo,
        pageSize,
        totalItems: combined.length,
        totalPages: Math.max(1, Math.ceil(combined.length / pageSize)),
        hasNextPage: startIndex + pageSize < combined.length,
        hasPreviousPage: pageNo > 1,
      },
    };
  },

  getTenantById: (contractMemberId: string): Promise<ContractTenantDetailDto> =>
    http.get<ContractTenantDetailDto>(`/contracts/tenants/${contractMemberId}`),
};

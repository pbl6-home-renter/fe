import { useMemo } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useTenantsQuery } from './use-tenants-query';
import type { ContractTenantListFilter, ContractTenantListItemDto, ContractTenantScope } from '../types/tenant.dto';

const COLUMN_IDS = ['tenantName', 'scope', 'isLinked', 'contractCount', 'actions'];
const ALLOWED_SORTS = ['tenantName'];
const DEFAULT_SORT = { id: 'tenantName', desc: false };
const DEFAULT_FILTERS = { scope: 'all' };
const DEFAULT_COLUMN_PINNING: ColumnPinningState = {
  left: ['tenantName'],
  right: ['actions'],
};
const REQUIRED_COLUMN_IDS = ['tenantName', 'actions'];

export const useTenantList = () => {
  const tableState = useDataTableState({
    tableId: 'landlord-tenants',
    columnIds: COLUMN_IDS,
    allowedSorts: ALLOWED_SORTS,
    defaultSort: DEFAULT_SORT,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_COLUMN_IDS,
  });

  const selectedScope = (
    tableState.filters.scope === 'current' || tableState.filters.scope === 'history' ? tableState.filters.scope : 'all'
  ) as 'all' | ContractTenantScope;

  const filterParam = useMemo<ContractTenantListFilter | undefined>(() => {
    if (selectedScope === 'all') return undefined;
    return { scope: selectedScope };
  }, [selectedScope]);

  const sorting = tableState.state.sorting[0];
  const search = tableState.search.trim().toLowerCase();

  const tenantsQuery = useTenantsQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: sorting?.id,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : 'asc',
    filter: filterParam,
  });

  const rawTenants: ContractTenantListItemDto[] = useMemo(
    () => tenantsQuery.data?.items ?? [],
    [tenantsQuery.data?.items],
  );

  const matchedTenants = useMemo(() => {
    if (!search) return rawTenants;
    return rawTenants.filter((tenant) => (tenant.tenantName || '').toLowerCase().includes(search));
  }, [rawTenants, search]);

  const isFiltered = selectedScope !== 'all' || Boolean(search);

  return {
    tableProps: {
      tenants: matchedTenants,
      rowCount: search ? matchedTenants.length : (tenantsQuery.data?.pagination.totalItems ?? matchedTenants.length),
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: tableState.setDensity,
      searchValue: tableState.search,
      onSearchChange: tableState.setSearch,
      selectedScope,
      onScopeChange: (scope: string) => tableState.setFilter('scope', scope === 'all' ? undefined : scope),
      isFiltered,
      onClearFilters: tableState.clearFilters,
      isLoading: tenantsQuery.isLoading,
      isFetching: tenantsQuery.isFetching,
      isError: tenantsQuery.isError,
      onRetry: () => void tenantsQuery.refetch(),
    },
    refetch: tenantsQuery.refetch,
  };
};

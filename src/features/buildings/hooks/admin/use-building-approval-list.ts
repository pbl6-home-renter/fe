import type { ColumnPinningState } from '@tanstack/react-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useDebounce } from '@/hooks/use-debounce';
import { BuildingStatus } from '../../enums/building-status.enum';
import { useAdminBuildingsQuery } from './use-admin-buildings-query';

const COLUMN_IDS = ['name', 'documents', 'createdAt', 'status', 'actions'];
const ALLOWED_SORTS = ['createdAt', 'name', 'status'];
const DEFAULT_SORT = { id: 'createdAt', desc: false };
const DEFAULT_FILTERS = { status: BuildingStatus.PENDING };
const DEFAULT_COLUMN_PINNING: ColumnPinningState = { left: ['name'], right: ['actions'] };
const REQUIRED_COLUMN_IDS = ['name', 'actions'];
const STATUS_VALUES: string[] = Object.values(BuildingStatus);

export const useBuildingApprovalList = () => {
  const tableState = useDataTableState({
    tableId: 'admin-building-approvals',
    columnIds: COLUMN_IDS,
    allowedSorts: ALLOWED_SORTS,
    defaultSort: DEFAULT_SORT,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_COLUMN_IDS,
  });
  const debouncedSearch = useDebounce(tableState.search.trim());
  const selectedStatus = STATUS_VALUES.includes(tableState.filters.status)
    ? tableState.filters.status
    : BuildingStatus.PENDING;
  const sorting = tableState.state.sorting[0];
  const query = useAdminBuildingsQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: sorting?.id,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : undefined,
    filter: {
      status: selectedStatus,
      q: debouncedSearch || undefined,
    },
  });

  return {
    totalItems: query.data?.pagination.totalItems ?? 0,
    tableProps: {
      buildings: query.data?.items ?? [],
      rowCount: query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: tableState.setDensity,
      searchValue: tableState.search,
      onSearchChange: tableState.setSearch,
      selectedStatus,
      onStatusChange: (status: string) => tableState.setFilter('status', status),
      isFiltered: Boolean(debouncedSearch),
      onClearFilters: () => tableState.setSearch(''),
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      onRetry: () => void query.refetch(),
    },
  };
};


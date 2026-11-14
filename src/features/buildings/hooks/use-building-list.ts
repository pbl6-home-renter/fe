import { useMemo, useState } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useDebounce } from '@/hooks/use-debounce';
import { useMyBuildingsQuery } from './use-my-buildings-query';
import { BuildingStatus } from '../enums/building-status.enum';
import type { BuildingFilter, BuildingMyListItemDto } from '../types/building.dto';

const COLUMN_IDS = ['name', 'address', 'status', 'rooms', 'occupancy', 'actions'];
const ALLOWED_SORTS = ['createdAt', 'name', 'status'];
const DEFAULT_SORT = { id: 'createdAt', desc: true };
const DEFAULT_FILTERS = { status: 'all' };
const DEFAULT_COLUMN_PINNING: ColumnPinningState = { left: ['name'], right: ['actions'] };
const REQUIRED_COLUMN_IDS = ['name', 'actions'];
const STATUS_VALUES: string[] = Object.values(BuildingStatus);
const EMPTY_BUILDINGS: BuildingMyListItemDto[] = [];

export const useBuildingList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const tableState = useDataTableState({
    tableId: 'landlord-buildings',
    columnIds: COLUMN_IDS,
    allowedSorts: ALLOWED_SORTS,
    defaultSort: DEFAULT_SORT,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_COLUMN_IDS,
  });
  const selectedStatus = STATUS_VALUES.includes(tableState.filters.status)
    ? tableState.filters.status
    : 'all';
  const sorting = tableState.state.sorting[0];
  const search = tableState.search.trim();
  const debouncedSearch = useDebounce(search, 300, true);
  const isDebouncing = search !== debouncedSearch;
  const filterParam: BuildingFilter = {
    ...(selectedStatus !== 'all' && { status: selectedStatus as BuildingStatus }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const query = useMyBuildingsQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: sorting?.id,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : undefined,
    filter: filterParam,
  }, { placeholderData: undefined });

  const rawBuildings: BuildingMyListItemDto[] = useMemo(
    () => isDebouncing ? EMPTY_BUILDINGS : query.data?.items ?? EMPTY_BUILDINGS,
    [isDebouncing, query.data?.items],
  );

  const metrics = useMemo(() => {
    if (isDebouncing || query.isError || !query.data) return null;
    const totalBuildings = query.data.pagination?.totalItems;
    const hasRooms = rawBuildings.every((building) => Number.isFinite(building.totalRooms));
    const hasOccupied = rawBuildings.every((building) => Number.isFinite(building.occupiedRooms));
    const totalRooms = hasRooms ? rawBuildings.reduce((sum, building) => sum + building.totalRooms!, 0) : null;
    const occupiedRooms = hasOccupied ? rawBuildings.reduce((sum, building) => sum + building.occupiedRooms, 0) : null;
    const approvedCount = rawBuildings.every((building) => building.status != null)
      ? rawBuildings.filter((building) => building.status === BuildingStatus.APPROVED).length
      : null;

    return {
      totalBuildings: Number.isFinite(totalBuildings) ? totalBuildings : null,
      totalRooms,
      occupiedRooms,
      occupancyRate: totalRooms === null || occupiedRooms === null
        ? null
        : totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 1000) / 10 : 0,
      approvedCount,
      pageBuildings: rawBuildings.length,
    };
  }, [isDebouncing, query.data, query.isError, rawBuildings]);

  const isFiltered = selectedStatus !== 'all' || Boolean(search);

  return {
    metrics,
    isCreateModalOpen,
    setIsCreateModalOpen,
    tableProps: {
      buildings: rawBuildings,
      rowCount: isDebouncing ? 0 : query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: tableState.setDensity,
      searchValue: tableState.search,
      onSearchChange: tableState.setSearch,
      selectedStatus,
      onStatusChange: (status: string) => tableState.setFilter('status', status === 'all' ? undefined : status),
      isFiltered,
      onClearFilters: tableState.clearFilters,
      isLoading: isDebouncing || query.isLoading,
      isFetching: isDebouncing || query.isFetching,
      isError: !isDebouncing && query.isError,
      onRetry: () => void query.refetch(),
      onCreate: () => setIsCreateModalOpen(true),
    },
    refetch: query.refetch,
  };
};

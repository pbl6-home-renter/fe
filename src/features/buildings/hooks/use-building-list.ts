import { useMemo, useState } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useMyBuildingsQuery } from './use-my-buildings-query';
import { BuildingStatus } from '../enums/building-status.enum';
import type { BuildingMyListItemDto } from '../types/building.dto';

const COLUMN_IDS = ['name', 'address', 'status', 'rooms', 'occupancy', 'actions'];
const ALLOWED_SORTS = ['createdAt', 'name', 'status'];
const DEFAULT_SORT = { id: 'createdAt', desc: true };
const DEFAULT_FILTERS = { status: 'all' };
const DEFAULT_COLUMN_PINNING: ColumnPinningState = { left: ['name'], right: ['actions'] };
const REQUIRED_COLUMN_IDS = ['name', 'actions'];
const STATUS_VALUES: string[] = Object.values(BuildingStatus);
// /me/buildings has no server-side search yet, so while searching we load the largest page
// the API allows and search + paginate it on the client.
const SEARCH_FETCH_SIZE = 100;

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
  const filterParam = selectedStatus !== 'all'
    ? { status: selectedStatus as BuildingStatus }
    : undefined;
  const search = tableState.search.trim().toLocaleLowerCase();

  const query = useMyBuildingsQuery({
    pageNo: search ? 1 : tableState.pageNo,
    pageSize: search ? SEARCH_FETCH_SIZE : tableState.pageSize,
    sort: sorting?.id,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : undefined,
    filter: filterParam,
  });

  const rawBuildings: BuildingMyListItemDto[] = useMemo(
    () => query.data?.items ?? [],
    [query.data?.items],
  );
  const matchedBuildings = useMemo(() => {
    if (!search) return rawBuildings;
    return rawBuildings.filter((building) =>
      building.name?.toLocaleLowerCase().includes(search)
      || building.address?.toLocaleLowerCase().includes(search),
    );
  }, [rawBuildings, search]);
  const buildings = useMemo(() => {
    if (!search) return matchedBuildings;
    const start = (tableState.pageNo - 1) * tableState.pageSize;
    return matchedBuildings.slice(start, start + tableState.pageSize);
  }, [matchedBuildings, search, tableState.pageNo, tableState.pageSize]);

  const metrics = useMemo(() => {
    const totalBuildings = query.data?.pagination.totalItems ?? rawBuildings.length;
    let totalRooms = 0;
    let occupiedRooms = 0;
    let approvedCount = 0;
    rawBuildings.forEach((building) => {
      totalRooms += building.totalRooms || 0;
      occupiedRooms += building.occupiedRooms || 0;
      if (building.status === BuildingStatus.APPROVED) approvedCount += 1;
    });

    return {
      totalBuildings,
      totalRooms,
      occupiedRooms,
      occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0',
      approvedCount,
    };
  }, [query.data?.pagination.totalItems, rawBuildings]);

  const isFiltered = selectedStatus !== 'all' || Boolean(search);

  return {
    metrics,
    isCreateModalOpen,
    setIsCreateModalOpen,
    tableProps: {
      buildings,
      rowCount: search ? matchedBuildings.length : query.data?.pagination.totalItems ?? 0,
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
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      onRetry: () => void query.refetch(),
      onCreate: () => setIsCreateModalOpen(true),
    },
    refetch: query.refetch,
  };
};

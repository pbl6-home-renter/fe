import { useCallback, useMemo, useState } from 'react';
import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  ALLOWED_MODERATION_SORTS,
  APPEAL_COLUMN_IDS,
  DEFAULT_MODERATION_COLUMN_PINNING,
  DEFAULT_MODERATION_PAGE_SIZE,
  REQUIRED_APPEAL_COLUMN_IDS,
} from '../constants/moderation.constants';
import { AppealStatus, isValidAppealStatus } from '../enums/moderation.enum';
import type { AppealAdminListItemDto, AppealListParams } from '../types/moderation.dto';
import { useAppealsQuery } from './use-appeals-query';

// `userId` comes from the admin user detail page link.
const DEFAULT_FILTERS = {
  status: AppealStatus.PENDING,
  userId: '',
};

export const useAppealList = () => {
  const tableState = useDataTableState({
    tableId: 'admin-appeals',
    columnIds: APPEAL_COLUMN_IDS,
    allowedSorts: ALLOWED_MODERATION_SORTS,
    defaultPageSize: DEFAULT_MODERATION_PAGE_SIZE,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_MODERATION_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_APPEAL_COLUMN_IDS,
  });
  const { setFilter, clearFilters, setDensity } = tableState;
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);

  const status = isValidAppealStatus(tableState.filters.status) ? tableState.filters.status : undefined;
  const userId = tableState.filters.userId || undefined;

  const queryParams = useMemo<AppealListParams>(
    () => ({ pageNo: tableState.pageNo, pageSize: tableState.pageSize, status, userId }),
    [tableState.pageNo, tableState.pageSize, status, userId],
  );
  const query = useAppealsQuery(queryParams);

  const onStatusChange = useCallback((value: string) => setFilter('status', value), [setFilter]);
  const onClearUser = useCallback(() => setFilter('userId', undefined), [setFilter]);
  const onViewDetail = useCallback((appeal: AppealAdminListItemDto) => setSelectedAppealId(appeal.id), []);

  return {
    totalItems: query.data?.pagination.totalItems ?? 0,
    isRefreshing: query.isFetching,
    onRefresh: () => void query.refetch(),
    selectedAppealId,
    onCloseDetail: () => setSelectedAppealId(null),
    tableProps: {
      appeals: query.data?.items ?? [],
      rowCount: query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: setDensity,
      selectedStatus: status ?? 'all',
      onStatusChange,
      userId: userId ?? null,
      onClearUser,
      isFiltered: status !== AppealStatus.PENDING || Boolean(userId),
      onClearFilters: clearFilters,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      onRetry: () => void query.refetch(),
      onViewDetail,
    },
  };
};

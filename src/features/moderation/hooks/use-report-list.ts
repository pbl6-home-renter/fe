import { useCallback, useMemo, useState } from 'react';
import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  ALLOWED_MODERATION_SORTS,
  DEFAULT_MODERATION_COLUMN_PINNING,
  DEFAULT_MODERATION_PAGE_SIZE,
  REPORT_COLUMN_IDS,
  REQUIRED_REPORT_COLUMN_IDS,
} from '../constants/moderation.constants';
import { ReportStatus, isValidReportCategory, isValidReportStatus } from '../enums/moderation.enum';
import type { ReportAdminListItemDto, ReportListParams } from '../types/moderation.dto';
import { useReportsQuery } from './use-reports-query';

// `reportedUserId` comes from the admin user detail page link.
const DEFAULT_FILTERS = {
  status: ReportStatus.PENDING,
  category: 'all',
  reportedUserId: '',
};

export const useReportList = () => {
  const tableState = useDataTableState({
    tableId: 'admin-reports',
    columnIds: REPORT_COLUMN_IDS,
    allowedSorts: ALLOWED_MODERATION_SORTS,
    defaultPageSize: DEFAULT_MODERATION_PAGE_SIZE,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_MODERATION_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_REPORT_COLUMN_IDS,
  });
  const { setFilter, clearFilters, setDensity } = tableState;
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const status = isValidReportStatus(tableState.filters.status) ? tableState.filters.status : undefined;
  const category = isValidReportCategory(tableState.filters.category) ? tableState.filters.category : undefined;
  const reportedUserId = tableState.filters.reportedUserId || undefined;

  const queryParams = useMemo<ReportListParams>(
    () => ({ pageNo: tableState.pageNo, pageSize: tableState.pageSize, status, category, reportedUserId }),
    [tableState.pageNo, tableState.pageSize, status, category, reportedUserId],
  );
  const query = useReportsQuery(queryParams);

  const onStatusChange = useCallback((value: string) => setFilter('status', value), [setFilter]);
  const onCategoryChange = useCallback(
    (value: string) => setFilter('category', value === 'all' ? undefined : value),
    [setFilter],
  );
  const onClearUser = useCallback(() => setFilter('reportedUserId', undefined), [setFilter]);
  const onViewDetail = useCallback((report: ReportAdminListItemDto) => setSelectedReportId(report.id), []);

  return {
    totalItems: query.data?.pagination.totalItems ?? 0,
    isRefreshing: query.isFetching,
    onRefresh: () => void query.refetch(),
    selectedReportId,
    onCloseDetail: () => setSelectedReportId(null),
    tableProps: {
      reports: query.data?.items ?? [],
      rowCount: query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: setDensity,
      selectedStatus: status ?? 'all',
      onStatusChange,
      selectedCategory: category ?? 'all',
      onCategoryChange,
      userId: reportedUserId ?? null,
      onClearUser,
      isFiltered: status !== ReportStatus.PENDING || Boolean(category || reportedUserId),
      onClearFilters: clearFilters,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      onRetry: () => void query.refetch(),
      onViewDetail,
    },
  };
};

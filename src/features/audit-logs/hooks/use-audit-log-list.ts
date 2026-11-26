import { useCallback, useMemo, useState } from 'react';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useDisclosure } from '@/hooks/use-disclosure';
import {
  ALLOWED_AUDIT_LOG_SORTS,
  AUDIT_LOG_COLUMN_IDS,
  DEFAULT_AUDIT_LOG_COLUMN_PINNING,
  DEFAULT_AUDIT_LOG_PAGE_SIZE,
  REQUIRED_AUDIT_LOG_COLUMN_IDS,
} from '../constants/audit-logs.constants';
import { isValidAuditLogAction } from '../enums/audit-log-action.enum';
import { isValidAuditLogEntityType } from '../enums/audit-log-entity-type.enum';
import type { AuditLogListItemDto, AuditLogListParams } from '../types/audit-logs.dto';
import { isDateRangeInvalid, isValidDateInput, toEndOfDayIso, toStartOfDayIso } from '../utils/audit-log-date.utils';
import { useAuditLogsQuery } from './use-audit-logs-query';

const DEFAULT_FILTERS = {
  action: 'all',
  entityType: 'all',
  from: '',
  to: '',
};

export const useAuditLogList = () => {
  const tableState = useDataTableState({
    tableId: 'admin-audit-logs',
    columnIds: AUDIT_LOG_COLUMN_IDS,
    allowedSorts: ALLOWED_AUDIT_LOG_SORTS,
    defaultPageSize: DEFAULT_AUDIT_LOG_PAGE_SIZE,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_AUDIT_LOG_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_AUDIT_LOG_COLUMN_IDS,
  });

  const { setFilter, clearFilters, setDensity } = tableState;
  const [selectedLog, setSelectedLog] = useState<AuditLogListItemDto | null>(null);
  const { isOpen: isDetailOpen, open: openDetail, close: closeDetail } = useDisclosure(false);

  const selectedAction = isValidAuditLogAction(tableState.filters.action) ? tableState.filters.action : undefined;
  const selectedEntityType = isValidAuditLogEntityType(tableState.filters.entityType)
    ? tableState.filters.entityType
    : undefined;

  const rawFrom = tableState.filters.from ?? '';
  const rawTo = tableState.filters.to ?? '';
  const validFrom = isValidDateInput(rawFrom) ? rawFrom : '';
  const validTo = isValidDateInput(rawTo) ? rawTo : '';
  const hasDateRangeError = isDateRangeInvalid(validFrom, validTo);

  const queryParams = useMemo<AuditLogListParams>(
    () => ({
      pageNo: tableState.pageNo,
      pageSize: tableState.pageSize,
      action: selectedAction,
      entityType: selectedEntityType,
      from: validFrom ? toStartOfDayIso(validFrom) : undefined,
      to: validTo ? toEndOfDayIso(validTo) : undefined,
    }),
    [tableState.pageNo, tableState.pageSize, selectedAction, selectedEntityType, validFrom, validTo],
  );

  // Do not fire API requests while the date range is invalid (from > to).
  const query = useAuditLogsQuery(queryParams, { enabled: !hasDateRangeError });

  const isFiltered = Boolean(selectedAction || selectedEntityType || validFrom || validTo);

  const handleActionChange = useCallback(
    (action: string) => {
      setFilter('action', action === 'all' ? undefined : action);
    },
    [setFilter],
  );

  const handleEntityTypeChange = useCallback(
    (entityType: string) => {
      setFilter('entityType', entityType === 'all' ? undefined : entityType);
    },
    [setFilter],
  );

  const handleFromDateChange = useCallback(
    (value: string) => {
      setFilter('from', value || undefined);
    },
    [setFilter],
  );

  const handleToDateChange = useCallback(
    (value: string) => {
      setFilter('to', value || undefined);
    },
    [setFilter],
  );

  const handleViewDetail = useCallback(
    (log: AuditLogListItemDto) => {
      setSelectedLog(log);
      openDetail();
    },
    [openDetail],
  );

  const handleCloseDetail = useCallback(() => {
    closeDetail();
  }, [closeDetail]);

  const { refetch } = query;

  const handleRefresh = useCallback(() => {
    if (!hasDateRangeError) {
      void refetch();
    }
  }, [hasDateRangeError, refetch]);

  return {
    totalItems: query.data?.pagination.totalItems ?? 0,
    isRefreshing: query.isFetching && !hasDateRangeError,
    onRefresh: handleRefresh,
    selectedLog,
    isDetailOpen,
    onCloseDetail: handleCloseDetail,
    tableProps: {
      auditLogs: query.data?.items ?? [],
      rowCount: query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: setDensity,
      selectedAction: selectedAction ?? 'all',
      onActionChange: handleActionChange,
      selectedEntityType: selectedEntityType ?? 'all',
      onEntityTypeChange: handleEntityTypeChange,
      fromDate: validFrom,
      onFromDateChange: handleFromDateChange,
      toDate: validTo,
      onToDateChange: handleToDateChange,
      hasDateRangeError,
      isFiltered,
      onClearFilters: clearFilters,
      isLoading: query.isLoading && !hasDateRangeError,
      isFetching: query.isFetching && !hasDateRangeError,
      isError: query.isError && !hasDateRangeError,
      onRetry: () => void query.refetch(),
      onViewDetail: handleViewDetail,
    },
  };
};

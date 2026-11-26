import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table/data-table';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { useDataTable } from '@/hooks/use-data-table';
import type { AuditLogListItemDto } from '../../types/audit-logs.dto';
import { useAuditLogListColumns } from './audit-log-list-columns';
import { AuditLogListMobileRow } from './audit-log-list-mobile-row';
import { AuditLogListToolbar } from './audit-log-list-toolbar';

export interface AuditLogListTableProps {
  auditLogs: AuditLogListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  selectedAction: string;
  onActionChange: (action: string) => void;
  selectedEntityType: string;
  onEntityTypeChange: (entityType: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  hasDateRangeError: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetail: (log: AuditLogListItemDto) => void;
}

export const AuditLogListTable = ({
  auditLogs,
  rowCount,
  state,
  handlers,
  density,
  onDensityChange,
  selectedAction,
  onActionChange,
  selectedEntityType,
  onEntityTypeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  hasDateRangeError,
  isFiltered,
  onClearFilters,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onViewDetail,
}: AuditLogListTableProps) => {
  const { t } = useTranslation('auditLogs');

  const columns = useAuditLogListColumns({ onViewDetail });

  const table = useDataTable({
    data: auditLogs,
    columns,
    getRowId: (log) => log.id,
    rowCount,
    mode: 'server',
    state,
    handlers,
    features: {
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  return (
    <DataTable
      table={table}
      tableId="admin-audit-logs"
      caption={t('list.title')}
      density={density}
      onDensityChange={onDensityChange}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      isFiltered={isFiltered}
      emptyState={{
        title: t('empty.title'),
        description: t('empty.description'),
      }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filters.reset'),
        onAction: onClearFilters,
      }}
      toolbar={
        <AuditLogListToolbar
          selectedAction={selectedAction}
          onActionChange={onActionChange}
          selectedEntityType={selectedEntityType}
          onEntityTypeChange={onEntityTypeChange}
          fromDate={fromDate}
          onFromDateChange={onFromDateChange}
          toDate={toDate}
          onToDateChange={onToDateChange}
          hasDateRangeError={hasDateRangeError}
          isFiltered={isFiltered}
          onClearFilters={onClearFilters}
        />
      }
      onRowClick={(log) => onViewDetail(log)}
      renderMobileRow={(row) => <AuditLogListMobileRow row={row} />}
    />
  );
};

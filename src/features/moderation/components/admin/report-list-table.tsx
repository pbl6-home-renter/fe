import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Image } from 'lucide-react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table/data-table';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { IconButton } from '@/components/ui/icon-button';
import type { SelectOption } from '@/components/ui/select-dropdown';
import { useDataTable } from '@/hooks/use-data-table';
import { formatDateTime } from '@/lib/utils/format';
import { REPORT_CATEGORY_VALUES, REPORT_STATUS_VALUES } from '../../enums/moderation.enum';
import type { ReportAdminListItemDto } from '../../types/moderation.dto';
import { ReportStatusBadge } from '../moderation-status-badge';
import { ModerationListToolbar } from './moderation-list-toolbar';
import { ModerationUserCell } from './moderation-user-cell';

export interface ReportListTableProps {
  reports: ReportAdminListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  userId: string | null;
  onClearUser: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetail: (report: ReportAdminListItemDto) => void;
}

const useReportColumns = (onViewDetail: (report: ReportAdminListItemDto) => void) => {
  const { t } = useTranslation('moderation');

  return useMemo<ColumnDef<ReportAdminListItemDto, unknown>[]>(
    () => [
      {
        id: 'reportedUser',
        header: t('reports.columns.reportedUser'),
        enableSorting: false,
        enableHiding: false,
        size: 260,
        minSize: 200,
        meta: { label: t('reports.columns.reportedUser'), hideable: false },
        cell: ({ row }) => <ModerationUserCell user={row.original.reportedUser} withStatus />,
      },
      {
        accessorKey: 'category',
        header: t('reports.columns.category'),
        enableSorting: false,
        size: 200,
        minSize: 160,
        meta: { label: t('reports.columns.category') },
        cell: ({ row }) => <Badge variant="secondary">{t(`categories.${row.original.category}.label`)}</Badge>,
      },
      {
        id: 'reporter',
        header: t('reports.columns.reporter'),
        enableSorting: false,
        size: 240,
        minSize: 180,
        meta: { label: t('reports.columns.reporter') },
        cell: ({ row }) => <ModerationUserCell user={row.original.reporter} />,
      },
      {
        accessorKey: 'createdAt',
        header: t('reports.columns.createdAt'),
        enableSorting: false,
        size: 200,
        minSize: 160,
        meta: { label: t('reports.columns.createdAt') },
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-sm tabular-nums">
            {formatDateTime(row.original.createdAt)}
            {row.original.evidenceCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-rentify-text-secondary">
                <Image className="h-3 w-3" aria-hidden="true" />
                {row.original.evidenceCount}
              </span>
            )}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('reports.columns.status'),
        enableSorting: false,
        size: 150,
        meta: { label: t('reports.columns.status') },
        cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 96,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={t('actions.viewDetail')}
              onClick={() => onViewDetail(row.original)}
              className="h-8 w-8 text-rentify-text-secondary hover:text-rentify-primary"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </div>
        ),
      },
    ],
    [t, onViewDetail],
  );
};

const ReportMobileRow = ({ row }: { row: Row<ReportAdminListItemDto> }) => {
  const { t } = useTranslation('moderation');
  const report = row.original;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <ModerationUserCell user={report.reportedUser} withStatus />
        <ReportStatusBadge status={report.status} />
      </div>
      <Badge variant="secondary">{t(`categories.${report.category}.label`)}</Badge>
      <p className="text-xs text-rentify-text-secondary">
        {t('reports.reportedBy', { name: report.reporter.name ?? t('user.unknown') })} ·{' '}
        <span className="tabular-nums">{formatDateTime(report.createdAt)}</span>
      </p>
    </div>
  );
};

export const ReportListTable = ({
  reports,
  rowCount,
  state,
  handlers,
  density,
  onDensityChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  userId,
  onClearUser,
  isFiltered,
  onClearFilters,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onViewDetail,
}: ReportListTableProps) => {
  const { t } = useTranslation('moderation');
  const columns = useReportColumns(onViewDetail);

  const statusOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allStatuses') },
      ...REPORT_STATUS_VALUES.map((status) => ({ value: status, label: t(`reportStatus.${status}`) })),
    ],
    [t],
  );

  const categoryOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allCategories') },
      ...REPORT_CATEGORY_VALUES.map((category) => ({ value: category, label: t(`categories.${category}.label`) })),
    ],
    [t],
  );

  const table = useDataTable({
    data: reports,
    columns,
    getRowId: (report) => report.id,
    rowCount,
    mode: 'server',
    state,
    handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });

  return (
    <DataTable
      table={table}
      tableId="admin-reports"
      caption={t('reports.title')}
      density={density}
      onDensityChange={onDensityChange}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      isFiltered={isFiltered}
      emptyState={{ title: t('reports.empty.title'), description: t('reports.empty.description') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filters.reset'),
        onAction: onClearFilters,
      }}
      toolbar={
        <ModerationListToolbar
          statusOptions={statusOptions}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          categoryOptions={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          userId={userId}
          onClearUser={onClearUser}
          isFiltered={isFiltered}
          onClearFilters={onClearFilters}
        />
      }
      onRowClick={(report) => onViewDetail(report)}
      renderMobileRow={(row) => <ReportMobileRow row={row} />}
    />
  );
};

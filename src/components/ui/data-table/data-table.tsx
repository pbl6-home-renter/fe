import { useEffect, type ReactNode } from 'react';
import type { Row, Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { DataTableDesktop } from './data-table-desktop';
import { DataTableMobile } from './data-table-mobile';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';
import type { DataTableDensity, DataTableEmptyState } from './data-table.types';

interface DataTableProps<TData> {
  table: Table<TData>;
  tableId: string;
  caption: string;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: boolean;
  onRetry?: () => void;
  toolbar?: ReactNode;
  emptyState: DataTableEmptyState;
  filteredEmptyState?: DataTableEmptyState;
  isFiltered?: boolean;
  renderMobileRow?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: TData) => void;
  maxHeight?: number;
}

export const DataTable = <TData,>({
  table,
  tableId,
  caption,
  density,
  onDensityChange,
  isLoading = false,
  isFetching = false,
  error = false,
  onRetry,
  toolbar,
  emptyState,
  filteredEmptyState,
  isFiltered = false,
  renderMobileRow,
  onRowClick,
  maxHeight,
}: DataTableProps<TData>) => {
  const { t } = useTranslation();
  const rows = table.getRowModel().rows;
  const selectedCount = table.getSelectedRowModel().rows.length;
  const activeEmptyState = isFiltered && filteredEmptyState ? filteredEmptyState : emptyState;
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const isPageOutOfRange = !isLoading && !isFetching && !error && pageIndex > 0 && pageIndex >= pageCount;

  // A stale URL (or deleting the last row of the last page) can leave pageIndex past the end;
  // jump back to the last page that has data instead of stranding the user on an empty page.
  useEffect(() => {
    if (isPageOutOfRange) table.setPageIndex(Math.max(0, pageCount - 1));
  }, [isPageOutOfRange, pageCount, table]);

  return (
    <Card className="relative overflow-hidden rounded-2xl border-rentify-divider bg-rentify-surface shadow-xs">
      {isFetching && !isLoading && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-rentify-primary-container"
          role="progressbar"
          aria-label={t('loadingData')}
        >
          <div className="ui-table-progress h-full w-1/3 rounded-full bg-rentify-primary" />
        </div>
      )}
      {(toolbar || table.getAllLeafColumns().length > 1) && (
        <div className="flex flex-col gap-3 border-b border-rentify-divider p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">{toolbar}</div>
          <DataTableViewOptions table={table} density={density} onDensityChange={onDensityChange} />
        </div>
      )}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between border-b border-rentify-divider bg-rentify-primary-container px-4 py-2 text-xs font-semibold text-rentify-text-primary">
          <span>{t('dataTable.selectedOnPage', { count: selectedCount })}</span>
          <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()}>
            {t('dataTable.clearSelection')}
          </Button>
        </div>
      )}
      {error ? (
        <ErrorState onRetry={onRetry} className="min-h-72" />
      ) : !isLoading && rows.length === 0 ? (
        <EmptyState {...activeEmptyState} className="min-h-72" />
      ) : (
        <>
          <DataTableDesktop
            table={table}
            tableId={tableId}
            caption={caption}
            density={density}
            isLoading={isLoading}
            onRowClick={onRowClick}
            maxHeight={maxHeight}
          />
          <DataTableMobile
            rows={rows}
            isLoading={isLoading}
            renderMobileRow={renderMobileRow}
            onRowClick={onRowClick}
          />
        </>
      )}
      {!error && !isLoading && rows.length > 0 && <DataTablePagination table={table} />}
    </Card>
  );
};

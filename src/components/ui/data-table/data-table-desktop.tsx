import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { flexRender, type Column, type Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { cn } from '@/lib/utils/cn';
import type { DataTableDensity } from './data-table.types';

interface DataTableDesktopProps<TData> {
  table: Table<TData>;
  tableId: string;
  caption: string;
  density: DataTableDensity;
  isLoading: boolean;
  onRowClick?: (row: TData) => void;
  maxHeight?: number;
}

const ROW_HEIGHTS: Record<DataTableDensity, string> = {
  compact: 'h-11',
  standard: 'h-14',
  comfortable: 'h-[68px]',
};

const getPinnedStyles = <TData,>(column: Column<TData, unknown>): CSSProperties => {
  const pinned = column.getIsPinned();
  return {
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: pinned ? 'sticky' : 'relative',
    zIndex: pinned ? 2 : 0,
    boxShadow: pinned === 'left' && column.getIsLastColumn('left')
      ? '-4px 0 4px -4px rgba(20, 42, 76, 0.24) inset'
      : pinned === 'right' && column.getIsFirstColumn('right')
        ? '4px 0 4px -4px rgba(20, 42, 76, 0.24) inset'
        : undefined,
    width: column.getSize(),
  };
};

const handleRowKeyDown = <TData,>(
  event: KeyboardEvent<HTMLTableRowElement>,
  row: TData,
  onRowClick?: (row: TData) => void,
) => {
  if (!onRowClick || event.target !== event.currentTarget) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  onRowClick(row);
};

export const DataTableDesktop = <TData,>({
  table,
  tableId,
  caption,
  density,
  isLoading,
  onRowClick,
  maxHeight,
}: DataTableDesktopProps<TData>) => {
  const { t } = useTranslation();
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  // Every column has a fixed width; the filler column absorbs the extra table width so the
  // rendered widths match column.getSize() and sticky offsets of pinned columns stay correct.
  const fillerIndex = (() => {
    const firstRight = visibleColumns.findIndex((column) => column.getIsPinned() === 'right');
    return firstRight === -1 ? visibleColumns.length : firstRight;
  })();
  const withFiller = <T,>(items: T[], filler: T) => [
    ...items.slice(0, fillerIndex),
    filler,
    ...items.slice(fillerIndex),
  ];

  return (
    <div className="hidden overflow-auto md:block" style={{ maxHeight }}>
      <table
        className="w-full table-fixed border-collapse text-left"
        style={{ minWidth: table.getTotalSize() }}
        data-table-id={tableId}
      >
        <caption className="sr-only">{caption}</caption>
        <thead className={cn(maxHeight && 'sticky top-0 z-10')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="h-11 border-b border-rentify-divider bg-surface-container-low">
              {withFiller<ReactNode>(headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const align = header.column.columnDef.meta?.align ?? 'left';
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className={cn(
                      'relative px-4 text-xs font-semibold uppercase tracking-wide text-rentify-text-secondary',
                      align === 'center' && 'text-center',
                      align === 'right' && 'text-right',
                    )}
                    style={{ ...getPinnedStyles(header.column), background: 'var(--color-surface-container-low)' }}
                  >
                    {!header.isPlaceholder && (header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          '-mx-2 h-8 gap-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-rentify-text-secondary',
                          align === 'right' && 'ml-auto',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' ? <ArrowUp className="h-3.5 w-3.5" />
                          : sorted === 'desc' ? <ArrowDown className="h-3.5 w-3.5" />
                            : <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />}
                      </Button>
                    ) : flexRender(header.column.columnDef.header, header.getContext()))}
                    {header.column.getCanResize() && (
                      <button
                        type="button"
                        aria-label={t('dataTable.resizeColumn', { column: header.column.columnDef.meta?.label ?? header.column.id })}
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent hover:border-rentify-primary focus:border-rentify-primary focus:outline-none"
                      />
                    )}
                  </th>
                );
              }), (
                <th
                  key="filler"
                  aria-hidden="true"
                  className="p-0"
                  style={{ background: 'var(--color-surface-container-low)' }}
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-rentify-divider">
          {isLoading ? Array.from(
            { length: Math.min(table.getState().pagination.pageSize, 10) },
            (_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className={ROW_HEIGHTS[density]}>
                {withFiller<ReactNode>(visibleColumns.map((column) => (
                  <td key={column.id} className="px-4"><Skeleton className="h-4 w-full" /></td>
                )), <td key="filler" aria-hidden="true" className="p-0" />)}
              </tr>
            ),
          ) : rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={() => onRowClick?.(row.original)}
              onKeyDown={(event) => handleRowKeyDown(event, row.original, onRowClick)}
              className={cn(
                ROW_HEIGHTS[density],
                'group transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rentify-primary',
                onRowClick && 'cursor-pointer',
              )}
            >
              {withFiller<ReactNode>(row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align ?? 'left';
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      'bg-rentify-surface px-4 text-sm text-rentify-text-primary group-hover:bg-surface-container-low',
                      align === 'center' && 'text-center',
                      align === 'right' && 'text-right',
                    )}
                    style={getPinnedStyles(cell.column)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              }), (
                <td
                  key="filler"
                  aria-hidden="true"
                  className="bg-rentify-surface p-0 group-hover:bg-surface-container-low"
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


import type { KeyboardEvent, ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/feedback/skeleton';
import { cn } from '@/lib/utils/cn';

interface DataTableMobileProps<TData> {
  rows: Row<TData>[];
  isLoading: boolean;
  renderMobileRow?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: TData) => void;
}

export const DataTableMobile = <TData,>({
  rows,
  isLoading,
  renderMobileRow,
  onRowClick,
}: DataTableMobileProps<TData>) => {
  const { t } = useTranslation();
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: TData) => {
    if (!onRowClick || event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onRowClick(row);
  };

  return (
    <div className="divide-y divide-rentify-divider md:hidden">
      {isLoading ? Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="space-y-2 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      )) : rows.map((row) => (
        <div
          key={row.id}
          tabIndex={onRowClick ? 0 : undefined}
          role={onRowClick ? 'button' : undefined}
          onClick={() => onRowClick?.(row.original)}
          onKeyDown={(event) => handleKeyDown(event, row.original)}
          className={cn(
            'min-h-28 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rentify-primary',
            onRowClick && 'cursor-pointer active:bg-surface-container-low',
          )}
        >
          {renderMobileRow
            ? renderMobileRow(row)
            : <p className="text-sm text-rentify-text-secondary">{t('dataTable.mobileRendererMissing')}</p>}
        </div>
      ))}
    </div>
  );
};


import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

type PageToken = number | 'ellipsis';

const getPageTokens = (current: number, total: number): PageToken[] => {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
};

export const DataTablePagination = <TData,>({ table }: DataTablePaginationProps<TData>) => {
  const { t } = useTranslation();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.options.rowCount ?? table.getPrePaginationRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const from = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalItems);
  const tokens = getPageTokens(pageIndex + 1, pageCount);

  return (
    <div className="flex flex-col gap-3 border-t border-rentify-divider px-4 py-3 text-xs text-rentify-text-secondary sm:flex-row sm:items-center sm:justify-between">
      <p className="tabular-nums" aria-live="polite">
        {t('dataTable.range', { from, to, total: totalItems })}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <div className="hidden items-center gap-2 md:flex">
          <span>{t('dataTable.rowsPerPage')}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 min-w-20 justify-between gap-2 px-3 tabular-nums"
                aria-label={`${t('dataTable.rowsPerPage')}: ${pageSize}`}
              >
                {pageSize}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="min-w-20">
              <DropdownMenuRadioGroup
                value={String(pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                {[10, 20, 50, 100].map((value) => (
                  <DropdownMenuRadioItem key={value} value={String(value)} className="tabular-nums">
                    {value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden items-center gap-1 sm:flex" aria-label={t('dataTable.pagination')}>
          {tokens.map((token, index) => token === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={token}
              variant={token === pageIndex + 1 ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 min-w-8 px-2 tabular-nums"
              aria-current={token === pageIndex + 1 ? 'page' : undefined}
              onClick={() => table.setPageIndex(token - 1)}
            >
              {token}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <IconButton
            variant="outline"
            size="sm"
            aria-label={t('dataTable.previousPage')}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <span className="min-w-16 text-center tabular-nums sm:hidden">
            {pageIndex + 1} / {pageCount}
          </span>
          <IconButton
            variant="outline"
            size="sm"
            aria-label={t('dataTable.nextPage')}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};


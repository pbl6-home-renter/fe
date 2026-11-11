import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ROUTES } from '@/config/routes.config';
import { formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceListItemDto } from '../types/invoices.dto';
import { InvoiceStatusBadge } from '../components/invoice-status-badge';

export const useInvoiceListColumns = (): ColumnDef<InvoiceListItemDto, unknown>[] => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();

  return useMemo<ColumnDef<InvoiceListItemDto, unknown>[]>(
    () => [
      {
        id: 'select',
        size: 48,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: { label: t('columns.select'), pinnable: false, hideable: false },
        header: ({ table }) => {
          const selectableRows = table.getRowModel().rows.filter((row) => row.getCanSelect());
          const allSelected = selectableRows.length > 0 && selectableRows.every((row) => row.getIsSelected());
          const someSelected = selectableRows.some((row) => row.getIsSelected()) && !allSelected;

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <Checkbox
                aria-label={t('columns.selectAllPending')}
                checked={allSelected}
                indeterminate={someSelected}
                disabled={selectableRows.length === 0}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const isPending = row.original.invoiceStatus === InvoiceStatus.PENDING;
          return (
            <div onClick={(event) => event.stopPropagation()}>
              <Checkbox
                aria-label={t('columns.selectRow', { code: row.original.code })}
                checked={row.getIsSelected()}
                disabled={!isPending}
                onChange={row.getToggleSelectedHandler()}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'code',
        header: t('columns.code'),
        enableSorting: false,
        enableHiding: false,
        size: 160,
        meta: { label: t('columns.code'), pinnable: true, hideable: false },
        cell: ({ row }) => (
          <span className="font-mono text-sm font-semibold text-rentify-text-primary">{row.original.code}</span>
        ),
      },
      {
        accessorKey: 'roomName',
        header: t('columns.room'),
        enableSorting: false,
        size: 140,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <span className="text-sm font-medium text-rentify-text-primary">{row.original.roomName}</span>
        ),
      },
      {
        accessorKey: 'tenantName',
        header: t('columns.tenant'),
        enableSorting: false,
        size: 200,
        meta: { label: t('columns.tenant') },
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-rentify-text-primary">{row.original.tenantName || '—'}</p>
            {row.original.tenantPhone && (
              <p className="truncate text-xs tabular-nums text-rentify-text-secondary">{row.original.tenantPhone}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'period',
        header: t('columns.period'),
        enableSorting: true,
        size: 130,
        meta: { label: t('columns.period') },
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-rentify-text-primary">{formatMonth(row.original.period)}</span>
        ),
      },
      {
        accessorKey: 'invoiceStatus',
        header: t('columns.status'),
        enableSorting: false,
        size: 150,
        meta: { label: t('columns.status') },
        cell: ({ row }) => <InvoiceStatusBadge status={row.original.invoiceStatus} />,
      },
      {
        accessorKey: 'totalAmount',
        header: t('columns.totalAmount'),
        enableSorting: false,
        size: 160,
        meta: { label: t('columns.totalAmount'), align: 'right' },
        cell: ({ row }) => (
          <span className="block text-right text-sm font-semibold tabular-nums text-rentify-text-primary">
            {formatVnd(row.original.totalAmount)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 140,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto gap-1.5 text-rentify-primary"
            onClick={(event) => {
              event.stopPropagation();
              navigate(ROUTES.LANDLORD.INVOICE_DETAIL(row.original.id));
            }}
          >
            <span>{t('actions.viewDetail')}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        ),
      },
    ],
    [navigate, t],
  );
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceStatusBadge } from '../components/invoice-status-badge';
import type { TenantInvoiceListItemDto } from '../types/invoices.dto';

export const useTenantInvoiceListColumns = (): ColumnDef<TenantInvoiceListItemDto, unknown>[] => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();

  return useMemo<ColumnDef<TenantInvoiceListItemDto, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: t('columns.code'),
        size: 165,
        minSize: 135,
        enableSorting: false,
        enableHiding: false,
        meta: { label: t('columns.code'), pinnable: true },
        cell: ({ row }) => (
          <span className="font-mono text-sm font-semibold text-rentify-text-primary">{row.original.code}</span>
        ),
      },
      {
        accessorKey: 'roomName',
        header: t('columns.room'),
        size: 150,
        minSize: 110,
        enableSorting: false,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <span className="text-sm font-medium text-rentify-text-primary">{row.original.roomName}</span>
        ),
      },
      {
        accessorKey: 'period',
        header: t('columns.period'),
        size: 140,
        minSize: 110,
        meta: { label: t('columns.period') },
        cell: ({ row }) => (
          <span className="text-sm text-rentify-text-primary">{formatMonth(row.original.period)}</span>
        ),
      },
      {
        accessorKey: 'invoiceStatus',
        header: t('columns.status'),
        size: 145,
        minSize: 120,
        enableSorting: false,
        meta: { label: t('columns.status') },
        cell: ({ row }) => <InvoiceStatusBadge status={row.original.invoiceStatus} />,
      },
      {
        accessorKey: 'totalAmount',
        header: t('columns.totalAmount'),
        size: 155,
        minSize: 130,
        enableSorting: false,
        meta: { label: t('columns.totalAmount'), align: 'right' as const },
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-rentify-text-primary">
            {formatVnd(row.original.totalAmount)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        size: 125,
        minSize: 110,
        enableSorting: false,
        enableHiding: false,
        meta: { label: t('columns.actions'), align: 'right' as const, pinnable: true },
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-rentify-primary"
              onClick={() => navigate(ROUTES.TENANT.INVOICE_DETAIL(row.original.id))}
            >
              <span>{t('actions.viewDetail')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate, t],
  );
};

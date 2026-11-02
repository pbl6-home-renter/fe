import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { ContractStatusBadge } from './contract-status-badge';
import { formatDate, formatVnd } from '@/lib/utils/format';
import type { ContractListItemDto } from '../types/contract.dto';

export const useContractListColumns = () => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();

  return useMemo<ColumnDef<ContractListItemDto, unknown>[]>(
    () => [
      {
        accessorKey: 'contractCode',
        header: t('columns.code'),
        size: 160,
        minSize: 130,
        meta: { label: t('columns.code'), pinnable: true },
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rentify-primary-container text-rentify-primary">
              <FileText className="h-4 w-4" />
            </div>
            <span className="truncate font-semibold text-rentify-text-primary group-hover:text-rentify-primary">
              {row.original.contractCode}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'roomName',
        header: t('columns.room'),
        size: 140,
        minSize: 110,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <span className="font-medium text-rentify-text-primary">
            {row.original.roomName}
          </span>
        ),
      },
      {
        accessorKey: 'tenantName',
        header: t('columns.tenant'),
        size: 180,
        minSize: 140,
        meta: { label: t('columns.tenant') },
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-rentify-text-primary">
              {row.original.tenantName || '—'}
            </span>
            <span className="text-xs text-rentify-text-secondary">
              {row.original.tenantPhone || ''}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'rentPrice',
        header: t('columns.rentPrice'),
        size: 150,
        meta: { label: t('columns.rentPrice'), align: 'right' },
        cell: ({ row }) => (
          <span className="font-semibold text-rentify-text-primary tabular-nums">
            {formatVnd(row.original.rentPrice)}
          </span>
        ),
      },
      {
        id: 'period',
        header: t('columns.period'),
        size: 210,
        meta: { label: t('columns.period') },
        cell: ({ row }) => (
          <span className="text-xs text-rentify-text-secondary tabular-nums">
            {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        size: 140,
        meta: { label: t('columns.status') },
        cell: ({ row }) => <ContractStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 120,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto gap-1 text-rentify-primary"
            onClick={(event) => {
              event.stopPropagation();
              navigate(ROUTES.LANDLORD.CONTRACT_DETAIL(row.original.id));
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [navigate, t]
  );
};

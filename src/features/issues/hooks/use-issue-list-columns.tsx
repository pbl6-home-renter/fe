import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils/format';
import type { IssueListItem } from '../types/issue.dto';

export const useIssueListColumns = (): ColumnDef<IssueListItem, unknown>[] => {
  const { t } = useTranslation('issues');

  return useMemo<ColumnDef<IssueListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('titleField'),
        size: 260,
        minSize: 180,
        enableSorting: false,
        enableHiding: false,
        meta: { label: t('titleField'), pinnable: true },
        cell: ({ row }) => <span className="font-semibold text-rentify-text-primary">{row.original.title}</span>,
      },
      {
        id: 'room',
        header: t('room'),
        size: 200,
        minSize: 140,
        enableSorting: false,
        meta: { label: t('room') },
        cell: ({ row }) => (
          <span className="text-sm text-rentify-text-secondary">
            {row.original.buildingName} · {row.original.roomName}
          </span>
        ),
      },
      {
        accessorKey: 'category',
        header: t('category'),
        size: 130,
        minSize: 100,
        enableSorting: false,
        meta: { label: t('category') },
        cell: ({ row }) => <span className="text-sm">{t(`categories.${row.original.category}`)}</span>,
      },
      {
        accessorKey: 'urgency',
        header: t('urgency'),
        size: 140,
        minSize: 100,
        enableSorting: false,
        meta: { label: t('urgency') },
        cell: ({ row }) => <span className="text-sm">{t(`urgencies.${row.original.urgency}`)}</span>,
      },
      {
        accessorKey: 'status',
        header: t('statusLabel'),
        size: 130,
        minSize: 100,
        enableSorting: false,
        meta: { label: t('statusLabel') },
        cell: ({ row }) => <span className="text-sm font-medium">{t(`statuses.${row.original.status}`)}</span>,
      },
      {
        accessorKey: 'createdAt',
        header: t('createdAt'),
        size: 130,
        minSize: 100,
        enableSorting: false,
        meta: { label: t('createdAt') },
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-rentify-text-secondary">{formatDate(row.original.createdAt)}</span>
        ),
      },
    ],
    [t],
  );
};

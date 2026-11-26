import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { IconButton } from '@/components/ui/icon-button';
import { formatDateTime } from '@/lib/utils/format';
import type { AuditLogListItemDto } from '../../types/audit-logs.dto';
import { AuditLogActionBadge } from './audit-log-action-badge';
import { AuditLogEntityLink } from './audit-log-entity-link';

export interface UseAuditLogListColumnsOptions {
  onViewDetail: (log: AuditLogListItemDto) => void;
}

export const useAuditLogListColumns = ({ onViewDetail }: UseAuditLogListColumnsOptions) => {
  const { t } = useTranslation('auditLogs');

  return useMemo<ColumnDef<AuditLogListItemDto, unknown>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        enableSorting: false,
        enableHiding: false,
        size: 240,
        minSize: 180,
        meta: { label: t('columns.createdAt'), pinnable: true, hideable: false },
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-rentify-text-primary">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: 'actorName',
        header: t('columns.actor'),
        enableSorting: false,
        size: 320,
        minSize: 200,
        meta: { label: t('columns.actor') },
        cell: ({ row }) => {
          const { actorName } = row.original;
          if (!actorName) {
            return <span className="italic text-rentify-text-secondary">{t('actor.deleted')}</span>;
          }
          return <span className="truncate font-medium text-rentify-text-primary">{actorName}</span>;
        },
      },
      {
        accessorKey: 'action',
        header: t('columns.action'),
        enableSorting: false,
        enableHiding: false,
        size: 300,
        minSize: 200,
        meta: { label: t('columns.action'), hideable: false },
        cell: ({ row }) => <AuditLogActionBadge action={row.original.action} />,
      },
      {
        id: 'entity',
        header: t('columns.entity'),
        enableSorting: false,
        size: 320,
        minSize: 200,
        meta: { label: t('columns.entity') },
        cell: ({ row }) => <AuditLogEntityLink entityType={row.original.entityType} entityId={row.original.entityId} />,
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
              aria-label={t('list.viewDetail')}
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

import type { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format';
import type { AuditLogListItemDto } from '../../types/audit-logs.dto';
import { AuditLogActionBadge } from './audit-log-action-badge';
import { AuditLogEntityLink } from './audit-log-entity-link';

export const AuditLogListMobileRow = ({ row }: { row: Row<AuditLogListItemDto> }) => {
  const { t } = useTranslation('auditLogs');
  const log = row.original;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AuditLogActionBadge action={log.action} />
        <span className="text-xs tabular-nums text-rentify-text-secondary">{formatDateTime(log.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-xs text-rentify-text-secondary">{t('columns.actor')}:</span>
        <span
          className={cn(
            log.actorName ? 'truncate font-medium text-rentify-text-primary' : 'italic text-rentify-text-secondary',
          )}
        >
          {log.actorName ?? t('actor.deleted')}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
        <span className="text-rentify-text-secondary">{t('columns.entity')}:</span>
        <AuditLogEntityLink entityType={log.entityType} entityId={log.entityId} />
      </div>
    </div>
  );
};

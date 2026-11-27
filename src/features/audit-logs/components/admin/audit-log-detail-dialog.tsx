import { useTranslation } from 'react-i18next';
import { Clock, FileText, Layers, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { formatDateTime } from '@/lib/utils/format';
import { useAuditLogDetailQuery } from '../../hooks/use-audit-log-detail-query';
import type { AuditLogListItemDto } from '../../types/audit-logs.dto';
import { parseAuditLogMetadata } from '../../utils/audit-log-metadata.utils';
import { AuditLogActionBadge } from './audit-log-action-badge';
import { AuditLogEntityLink } from './audit-log-entity-link';

export interface AuditLogDetailDialogProps {
  open: boolean;
  onClose: () => void;
  auditLog: AuditLogListItemDto | null;
}

export const AuditLogDetailDialog = ({ open, onClose, auditLog }: AuditLogDetailDialogProps) => {
  const { t } = useTranslation('auditLogs');
  const auditLogId = auditLog?.id ?? '';

  const query = useAuditLogDetailQuery(auditLogId, {
    enabled: open && Boolean(auditLogId),
  });

  if (!auditLog) return null;

  const detail = query.data;
  const metadataEntries = parseAuditLogMetadata(detail?.metadata);

  const translateFieldName = (field: string): string => {
    switch (field) {
      case 'name':
        return t('metadata.fields.name');
      case 'phone':
        return t('metadata.fields.phone');
      case 'email':
        return t('metadata.fields.email');
      case 'role':
        return t('metadata.fields.role');
      case 'status':
        return t('metadata.fields.status');
      case 'avatarUrl':
        return t('metadata.fields.avatarUrl');
      default:
        return field;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('detail.title')}
      description={formatDateTime(auditLog.createdAt)}
      maxWidth="lg"
      footer={
        <Button variant="outline" size="sm" onClick={onClose}>
          {t('detail.close')}
        </Button>
      }
    >
      {query.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : query.isError || !detail ? (
        <ErrorState
          title={t('detail.errorTitle')}
          message={t('detail.errorDescription')}
          retryText={t('detail.retry')}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AuditLogActionBadge action={detail.action} />
              <span className="flex items-center gap-1.5 text-xs tabular-nums text-rentify-text-secondary">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{formatDateTime(detail.createdAt)}</span>
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-3 pt-2 border-t border-rentify-divider sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('columns.actor')}</span>
                </dt>
                <dd className="text-sm font-medium text-rentify-text-primary">
                  {detail.actorName ?? (
                    <span className="italic font-normal text-rentify-text-secondary">{t('actor.deleted')}</span>
                  )}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('columns.entity')}</span>
                </dt>
                <dd>
                  <AuditLogEntityLink entityType={detail.entityType} entityId={detail.entityId} onNavigate={onClose} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-rentify-divider bg-rentify-surface p-4 space-y-2.5">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-rentify-text-primary">
              <FileText className="h-4 w-4 text-rentify-primary" aria-hidden="true" />
              <span>{t('detail.metadataTitle')}</span>
            </h3>

            {metadataEntries.length === 0 ? (
              <p className="text-sm text-rentify-text-secondary">{t('detail.noMetadata')}</p>
            ) : (
              <ul className="space-y-2">
                {metadataEntries.map((entry) => (
                  <li key={entry.kind} className="text-sm text-rentify-text-primary leading-relaxed">
                    {entry.kind === 'changedFields' && (
                      <span>
                        <span className="font-medium text-rentify-text-secondary">{t('metadata.changedFields')}: </span>
                        {entry.fields.map(translateFieldName).join(', ')}
                      </span>
                    )}
                    {entry.kind === 'lockReason' && (
                      <span>
                        <span className="font-medium text-rentify-text-secondary">{t('metadata.lockReason')}: </span>
                        {entry.value}
                      </span>
                    )}
                    {entry.kind === 'note' && (
                      <span>
                        <span className="font-medium text-rentify-text-secondary">{t('metadata.note')}: </span>
                        {entry.value}
                      </span>
                    )}
                    {entry.kind === 'rejectReason' && (
                      <span>
                        <span className="font-medium text-rentify-text-secondary">{t('metadata.rejectReason')}: </span>
                        {entry.value}
                      </span>
                    )}
                    {(entry.kind === 'reportId' || entry.kind === 'appealId') && (
                      <span>
                        <span className="font-medium text-rentify-text-secondary">{t('metadata.source')}: </span>
                        {entry.kind === 'reportId'
                          ? t('metadata.fromReport', { id: entry.value.slice(0, 8) })
                          : t('metadata.fromAppeal', { id: entry.value.slice(0, 8) })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
};

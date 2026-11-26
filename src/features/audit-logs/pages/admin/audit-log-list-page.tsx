import { useTranslation } from 'react-i18next';
import { History, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils/cn';
import { AuditLogDetailDialog } from '../../components/admin/audit-log-detail-dialog';
import { AuditLogListTable } from '../../components/admin/audit-log-list-table';
import { useAuditLogList } from '../../hooks/use-audit-log-list';

export const AuditLogListPage = () => {
  const { t } = useTranslation('auditLogs');
  const { totalItems, isRefreshing, onRefresh, selectedLog, isDetailOpen, onCloseDetail, tableProps } =
    useAuditLogList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('list.title')}
        description={t('list.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" leadingIcon={<History className="h-4 w-4" aria-hidden="true" />}>
              {t('list.totalBadge', { count: totalItems })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing || tableProps.hasDateRangeError}
              className="min-h-10 gap-1.5"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} aria-hidden="true" />
              <span>{t('list.refresh')}</span>
            </Button>
          </div>
        }
      />

      <AuditLogListTable {...tableProps} />

      <AuditLogDetailDialog open={isDetailOpen} onClose={onCloseDetail} auditLog={selectedLog} />
    </div>
  );
};

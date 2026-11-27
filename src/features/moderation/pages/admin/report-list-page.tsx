import { useTranslation } from 'react-i18next';
import { Flag, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils/cn';
import { ReportDetailDialog } from '../../components/admin/report-detail-dialog';
import { ReportListTable } from '../../components/admin/report-list-table';
import { useReportList } from '../../hooks/use-report-list';

export const ReportListPage = () => {
  const { t } = useTranslation('moderation');
  const { totalItems, isRefreshing, onRefresh, selectedReportId, onCloseDetail, tableProps } = useReportList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('reports.title')}
        description={t('reports.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" leadingIcon={<Flag className="h-4 w-4" aria-hidden="true" />}>
              {t('list.totalBadge', { count: totalItems })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="min-h-10 gap-1.5"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} aria-hidden="true" />
              <span>{t('list.refresh')}</span>
            </Button>
          </div>
        }
      />

      <ReportListTable {...tableProps} />

      <ReportDetailDialog reportId={selectedReportId} onClose={onCloseDetail} />
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { RefreshCw, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils/cn';
import { AppealDetailDialog } from '../../components/admin/appeal-detail-dialog';
import { AppealListTable } from '../../components/admin/appeal-list-table';
import { useAppealList } from '../../hooks/use-appeal-list';

export const AppealListPage = () => {
  const { t } = useTranslation('moderation');
  const { totalItems, isRefreshing, onRefresh, selectedAppealId, onCloseDetail, tableProps } = useAppealList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('appeals.title')}
        description={t('appeals.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" leadingIcon={<Scale className="h-4 w-4" aria-hidden="true" />}>
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

      <AppealListTable {...tableProps} />

      <AppealDetailDialog appealId={selectedAppealId} onClose={onCloseDetail} />
    </div>
  );
};

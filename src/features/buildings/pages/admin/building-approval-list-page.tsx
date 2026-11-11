import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { ApprovalTable } from '../../components/admin/approval-table';
import { useBuildingApprovalList } from '../../hooks/admin/use-building-approval-list';

export const BuildingApprovalListPage = () => {
  const { t } = useTranslation('buildings');
  const { totalItems, tableProps } = useBuildingApprovalList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.queueTitle')}
        description={t('admin.queueSubtitle')}
        actions={
          <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rentify-divider bg-rentify-surface px-3 text-xs font-semibold text-rentify-text-primary shadow-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rentify-warning" />
            <span>{t('admin.totalPendingBadge', { count: totalItems })}</span>
          </div>
        }
      />

      <ApprovalTable {...tableProps} />
    </div>
  );
};

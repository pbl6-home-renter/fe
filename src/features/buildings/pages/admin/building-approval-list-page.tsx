import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
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
        actions={<Badge variant="warning">{t('admin.totalPendingBadge', { count: totalItems })}</Badge>}
      />

      <ApprovalTable {...tableProps} />
    </div>
  );
};

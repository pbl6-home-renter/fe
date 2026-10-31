import { useTranslation } from 'react-i18next';
import { ApprovalTable } from '../../components/admin/approval-table';
import { useBuildingApprovalList } from '../../hooks/admin/use-building-approval-list';

export const BuildingApprovalListPage = () => {
  const { t } = useTranslation('buildings');
  const { totalItems, tableProps } = useBuildingApprovalList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary sm:text-3xl">
            {t('admin.queueTitle')}
          </h1>
          <p className="mt-1 text-sm text-rentify-text-secondary">{t('admin.queueSubtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-rentify-divider bg-rentify-surface px-3 py-1.5 text-xs font-semibold text-rentify-text-primary shadow-xs md:self-auto">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rentify-warning" />
          <span>{t('admin.totalPendingBadge', { count: totalItems })}</span>
        </div>
      </div>

      <ApprovalTable {...tableProps} />
    </div>
  );
};

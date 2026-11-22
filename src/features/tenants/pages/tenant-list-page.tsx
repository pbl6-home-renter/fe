import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { TenantListTable } from '../components/tenant-list-table';
import { useTenantList } from '../hooks/use-tenant-list';

export const TenantListPage = () => {
  const { t } = useTranslation('tenants');
  const { tableProps } = useTenantList();

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('subtitle')} />

      <TenantListTable {...tableProps} />
    </div>
  );
};

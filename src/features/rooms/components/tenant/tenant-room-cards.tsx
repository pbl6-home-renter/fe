import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes.config';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import { formatDate } from '@/lib/utils/format';

export const TenantRoomCards = ({ contracts }: { contracts: MyContractListItemDto[] }) => {
  const { t } = useTranslation('rooms');
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {contracts.map((contract) => (
        <Card key={contract.id} className="space-y-3">
          <h2 className="text-lg font-semibold text-rentify-text-primary">{contract.roomName}</h2>
          <p className="text-sm text-rentify-text-secondary">{contract.buildingName}</p>
          <p className="text-sm text-rentify-text-secondary">{t('tenantRoom.contractCode', { code: contract.contractCode })}</p>
          <p className="text-sm text-rentify-text-secondary">{t('tenantRoom.dates', { start: formatDate(contract.startDate), end: formatDate(contract.endDate) })}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-rentify-primary">
            <Link to={ROUTES.TENANT.CONTRACT_DETAIL(contract.id)} className="hover:underline">{t('tenantRoom.viewContract')}</Link>
            <Link to={ROUTES.TENANT.INVOICES} className="hover:underline">{t('tenantRoom.viewInvoices')}</Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText, Home, Receipt } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { TenantRoomCards } from '@/features/rooms/components/tenant/tenant-room-cards';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';

export interface TenantDashboardFullStateProps {
  contracts: MyContractListItemDto[];
  activeCount: number;
}

export const TenantDashboardFullState = ({ contracts, activeCount }: TenantDashboardFullStateProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tenant.dashboardTitle')}
        description={t('tenant.dashboardSubtitle')}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(ROUTES.TENANT.INVOICES)}
              className="gap-2 border-rentify-divider"
            >
              <Receipt className="w-4 h-4" />
              <span>{t('tenant.viewInvoices')}</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.TENANT.CONTRACTS)}
              className="gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>{t('tenant.viewContracts')}</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('tenant.activeRooms')}</span>
            <Home className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-text-primary tracking-tight">{activeCount}</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('tenant.activeContracts')}</span>
            <FileText className="w-5 h-5 text-rentify-success" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-success tracking-tight">{activeCount}</span>
          </div>
        </Card>

        <Card
          variant="interactive"
          onClick={() => navigate(ROUTES.TENANT.INVOICES)}
          className="flex flex-col justify-between p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('tenant.viewInvoices')}</span>
            <Receipt className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-rentify-primary">
            <span>{t('tenant.viewInvoices')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-rentify-text-primary">{t('tenant.myRoomsTitle')}</h2>
            <span className="rounded-full bg-rentify-surface-container-low px-2.5 py-0.5 text-xs font-semibold text-rentify-text-secondary border border-rentify-divider">
              {t('tenant.previewCount', { count: activeCount })}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.TENANT.ROOMS)}
            className="gap-1 text-rentify-primary"
          >
            <span>{t('tenant.viewAllRooms')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <TenantRoomCards contracts={contracts} />
      </div>
    </div>
  );
};

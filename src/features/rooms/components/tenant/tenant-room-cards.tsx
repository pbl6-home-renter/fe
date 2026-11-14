import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Calendar, FileText, Home, Receipt, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { ContractStatusBadge } from '@/features/contracts/components/contract-status-badge';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import { formatDate, formatVnd } from '@/lib/utils/format';

export interface TenantRoomCardsProps {
  contracts: MyContractListItemDto[];
}

export const TenantRoomCards = ({ contracts }: TenantRoomCardsProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {contracts.map((contract) => (
        <Card key={contract.id} className="flex flex-col justify-between gap-4 p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container/20 text-rentify-primary">
                  <Home className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-rentify-text-primary">{contract.roomName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary mt-0.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{contract.buildingName}</span>
                  </div>
                </div>
              </div>

              <ContractStatusBadge status={contract.status} variant="pill" />
            </div>

            <div className="space-y-2 rounded-xl border border-rentify-divider bg-rentify-surface-container-low/50 p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-rentify-text-secondary">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{t('tenantRoom.contractCode', { code: contract.contractCode })}</span>
                </span>
                <span className="font-semibold tabular-nums text-rentify-text-primary">
                  {formatVnd(contract.rentPrice)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-rentify-text-secondary">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {t('tenantRoom.dates', { start: formatDate(contract.startDate), end: formatDate(contract.endDate) })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-rentify-divider">
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.TENANT.INVOICES)} className="gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              <span>{t('tenantRoom.viewInvoices')}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.TENANT.CONTRACT_DETAIL(contract.id))}
              className="gap-1.5"
            >
              <span>{t('tenantRoom.viewContract')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

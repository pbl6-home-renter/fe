import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, Calendar, CheckCircle2, Home, Receipt, ShieldCheck, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { ContractStatusBadge } from '@/features/contracts/components/contract-status-badge';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import { formatDate, formatVnd } from '@/lib/utils/format';
import { calculateContractTimeline } from '../../utils/contract-timeline';

export interface TenantRoomCardItemProps {
  contract: MyContractListItemDto;
}

export const TenantRoomCardItem = ({ contract }: TenantRoomCardItemProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const timeline = calculateContractTimeline(contract.startDate, contract.endDate);

  return (
    <Card className="rounded-3xl border border-rentify-divider bg-rentify-card shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Room Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rentify-divider">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rentify-primary-container/20 text-rentify-primary shadow-xs">
            <Home className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-rentify-text-primary">
                {contract.roomName}
              </h2>
              <ContractStatusBadge status={contract.status} variant="pill" />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-rentify-text-secondary mt-1">
              <Building2 className="h-4 w-4 shrink-0 text-rentify-outline" />
              <span className="font-medium text-rentify-text-primary">{contract.buildingName}</span>
              <span>•</span>
              <span className="font-mono text-rentify-text-secondary">
                {t('tenantRoom.contractCode', { code: contract.contractCode })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('tenantRoom.rentPriceLabel')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-rentify-primary">
              {formatVnd(contract.rentPrice)}
            </span>
            <span className="text-xs text-rentify-text-secondary">{t('tenantRoom.monthUnit')}</span>
          </div>
        </div>
      </div>

      {/* Contract Timeline and Progress Meter */}
      <div className="rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/60 p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-semibold text-rentify-text-primary">
            <Calendar className="h-4 w-4 text-rentify-primary" />
            <span>{t('tenantRoom.contractTimelineTitle')}</span>
          </div>
          <span className="font-mono text-xs text-rentify-text-secondary">
            {formatDate(contract.startDate)} — {formatDate(contract.endDate)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-rentify-divider/50 rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-rentify-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${timeline.percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
          <span>
            {t('tenantRoom.completedDays', {
              days: timeline.elapsedDays,
              percent: timeline.percent,
            })}
          </span>
          <span className="font-medium text-rentify-text-primary">
            {t('tenantRoom.remainingDays', { days: timeline.remainingDays })}
          </span>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Hóa đơn */}
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('tenantRoom.metricInvoicesTitle')}
            </span>
            <Receipt className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rentify-success" />
              <span className="text-xs font-medium text-rentify-text-primary">{t('tenantRoom.activeRent')}</span>
            </div>
            <div className="text-base font-bold text-rentify-text-primary mt-1">{formatVnd(contract.rentPrice)}</div>
          </div>
        </div>

        {/* Metric 2: Tiền đặt cọc */}
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('tenantRoom.metricDepositTitle')}
            </span>
            <ShieldCheck className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rentify-primary" />
              <span className="text-xs font-medium text-rentify-text-primary">{t('tenantRoom.securedDeposit')}</span>
            </div>
            <div className="text-base font-bold text-rentify-text-primary mt-1">
              {formatVnd(contract.depositAmount)}
            </div>
          </div>
        </div>

        {/* Metric 3: Sự cố */}
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('tenantRoom.metricSupportTitle')}
            </span>
            <Wrench className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rentify-success" />
              <span className="text-xs font-medium text-rentify-text-primary">{t('tenantRoom.supportActive')}</span>
            </div>
            <div className="text-xs text-rentify-text-secondary mt-1">{t('tenantRoom.supportHint')}</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rentify-divider">
        <div className="flex items-center gap-2 text-xs text-rentify-text-secondary">
          <CheckCircle2 className="h-4 w-4 text-rentify-success shrink-0" />
          <span>{t('tenantRoom.contractVerifiedNotice')}</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.TENANT.INVOICES)}
            className="gap-1.5 w-full sm:w-auto text-xs"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>{t('tenantRoom.viewInvoices')}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.TENANT.CONTRACT_DETAIL(contract.id))}
            className="gap-1.5 w-full sm:w-auto text-xs"
          >
            <span>{t('tenantRoom.viewContract')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

import { useTranslation } from 'react-i18next';
import { AlertCircle, Building2, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface LandlordKpiGridProps {
  metrics: {
    total: number;
    active: number;
    pending: number;
    others: number | null;
  };
}

export const LandlordKpiGrid = ({ metrics }: LandlordKpiGridProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Buildings */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.totalBuildings')}</span>
          <Building2 className="w-4 h-4 text-rentify-primary" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
            {metrics.total}
          </span>
        </div>
      </Card>

      {/* Active Buildings */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.activeBuildings')}</span>
          <ShieldCheck className="w-4 h-4 text-rentify-success" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-success tracking-tight tabular-nums">
            {metrics.active}
          </span>
          <span className="text-[11px] font-semibold text-rentify-success bg-rentify-success/10 px-2 py-0.5 rounded-full">
            {t('full.statusActiveTag')}
          </span>
        </div>
      </Card>

      {/* Pending Buildings */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.pendingBuildings')}</span>
          <Clock className="w-4 h-4 text-rentify-warning" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-warning tracking-tight tabular-nums">
            {metrics.pending}
          </span>
          <span className="text-[11px] font-semibold text-rentify-warning bg-rentify-warning/10 px-2 py-0.5 rounded-full">
            {t('full.statusPendingTag')}
          </span>
        </div>
      </Card>

      {/* Other / Incomplete Buildings */}
      {metrics.others !== null && (
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('full.otherBuildings')}</span>
            <AlertCircle className="w-4 h-4 text-rentify-neutral" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {metrics.others}
            </span>
            <span className="text-[11px] font-semibold text-rentify-text-secondary bg-rentify-background px-2 py-0.5 rounded-full">
              {t('full.statusOthersTag')}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

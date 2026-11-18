import { useTranslation } from 'react-i18next';
import { AlertTriangle, Building2, FileText, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface LandlordKpiGridProps {
  metrics: {
    total: number;
    active: number;
    pending: number;
    others: number | null;
    occupiedRooms?: number;
    totalRooms?: number;
    activeContractsCount?: number;
    openIssuesCount?: number;
  };
}

export const LandlordKpiGrid = ({ metrics }: LandlordKpiGridProps) => {
  const { t } = useTranslation('dashboard');

  const occupiedCount = metrics.occupiedRooms ?? 0;
  const totalRoomsCount = metrics.totalRooms ?? 0;
  const occupancyPercentage = totalRoomsCount > 0 ? Math.round((occupiedCount / totalRoomsCount) * 100) : 0;
  const activeContracts = metrics.activeContractsCount ?? 0;
  const openIssues = metrics.openIssuesCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Buildings */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.totalBuildings')}</span>
          <Building2 className="w-4 h-4 text-rentify-primary" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
            {metrics.total}
          </span>
          <span className="text-[11px] font-semibold text-rentify-success bg-rentify-success/10 px-2 py-0.5 rounded-full">
            {t('full.statusActiveTag')}
          </span>
        </div>
      </Card>

      {/* 2. Occupied Rooms */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.activeRooms')}</span>
          <Home className="w-4 h-4 text-rentify-primary" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
            {occupiedCount}
          </span>
          {totalRoomsCount > 0 && (
            <span className="text-[11px] font-semibold text-rentify-primary bg-primary-container/20 px-2 py-0.5 rounded-full">
              {occupancyPercentage}%
            </span>
          )}
        </div>
      </Card>

      {/* 3. Active Contracts */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.activeContracts')}</span>
          <FileText className="w-4 h-4 text-rentify-success" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rentify-success tracking-tight tabular-nums">
            {activeContracts}
          </span>
        </div>
      </Card>

      {/* 4. Open Issues */}
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('full.openIssues')}</span>
          <AlertTriangle className={`w-4 h-4 ${openIssues > 0 ? 'text-rentify-warning' : 'text-rentify-neutral'}`} />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
              openIssues > 0 ? 'text-rentify-warning' : 'text-rentify-text-primary'
            }`}
          >
            {openIssues}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              openIssues > 0
                ? 'text-rentify-warning bg-rentify-warning/10'
                : 'text-rentify-success bg-rentify-success/10'
            }`}
          >
            {openIssues > 0 ? t('full.statusPendingTag') : t('full.statusActiveTag')}
          </span>
        </div>
      </Card>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { Building2, DoorClosed, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';

interface BuildingMetricsMosaicProps {
  metrics: {
    totalBuildings: number | null;
    totalRooms: number | null;
    occupiedRooms: number | null;
    occupancyRate: number | null;
    approvedCount: number | null;
    pageBuildings: number;
  } | null;
}

export const BuildingMetricsMosaic = ({ metrics }: BuildingMetricsMosaicProps) => {
  const { t } = useTranslation('buildings');
  const valueClass = 'text-3xl font-bold text-rentify-text-primary tracking-tight';
  const scopeClass = 'mt-3 text-xs text-rentify-text-secondary';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.totalBuildings')}</span>
          <Building2 className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4"><span className={valueClass}>{metrics?.totalBuildings ?? '—'}</span></div>
        <div className={scopeClass}>{t('list.filteredResultsScope')}</div>
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.totalRooms')}</span>
          <DoorClosed className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4"><span className={valueClass}>{metrics?.totalRooms ?? '—'}</span></div>
        <div className={scopeClass}>{t('list.currentPageScope')} · {metrics?.occupiedRooms == null ? '—' : t('list.occupiedRoomsCount', { count: metrics.occupiedRooms })}</div>
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.occupancyRate')}</span>
          <TrendingUp className="w-5 h-5 text-rentify-success" />
        </div>
        <div className="mt-4"><span className={valueClass}>{metrics?.occupancyRate == null ? '—' : `${metrics.occupancyRate}%`}</span></div>
        <div className={scopeClass}>{t('list.currentPageScope')}</div>
        {metrics?.occupancyRate != null && (
          <ProgressMeterTrack value={metrics.occupancyRate} size="sm" warningThreshold={101} label={t('list.occupancyRate')} className="mt-3 [&>div:first-child]:sr-only" />
        )}
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.approvedOnPage')}</span>
          <ShieldCheck className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4"><span className={valueClass}>{metrics?.approvedCount == null ? '—' : `${metrics.approvedCount}/${metrics.pageBuildings}`}</span></div>
        <div className={scopeClass}>{t('list.currentPageScope')}</div>
      </Card>
    </div>
  );
};

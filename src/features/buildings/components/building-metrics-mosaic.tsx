import { useTranslation } from 'react-i18next';
import { Building2, DoorClosed, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';

interface BuildingMetricsMosaicProps {
  metrics: {
    totalBuildings: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: string;
    approvedCount: number;
  };
}

export const BuildingMetricsMosaic = ({ metrics }: BuildingMetricsMosaicProps) => {
  const { t } = useTranslation('buildings');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total buildings */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.totalBuildings')}</span>
          <Building2 className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">{metrics.totalBuildings}</span>
          <span className="text-xs text-rentify-text-secondary">{t('list.buildingsUnit')}</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-rentify-success text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-rentify-success" />
          <span>{t('list.approvedBuildings', { count: metrics.approvedCount })}</span>
        </div>
      </Card>

      {/* Rooms scale */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.totalRooms')}</span>
          <DoorClosed className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">{metrics.totalRooms}</span>
          <span className="text-xs text-rentify-text-secondary">{t('list.roomsUnit')}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-rentify-text-secondary">
          <span>{t('list.occupiedRoomsCount', { count: metrics.occupiedRooms })}</span>
          <span>{t('list.emptyRoomsCount', { count: Math.max(0, metrics.totalRooms - metrics.occupiedRooms) })}</span>
        </div>
      </Card>

      {/* Occupancy rate */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.occupancyRate')}</span>
          <TrendingUp className="w-5 h-5 text-rentify-success" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">{metrics.occupancyRate}%</span>
          <span className="text-xs text-rentify-text-secondary">{t('list.occupiedRooms')}</span>
        </div>
        <ProgressMeterTrack
          value={Number(metrics.occupancyRate)}
          size="sm"
          warningThreshold={101}
          label={t('list.occupancyRate')}
          className="mt-3 [&>div:first-child]:sr-only"
        />
      </Card>

      {/* Approval status */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-rentify-text-secondary">
          <span className="text-xs font-semibold">{t('list.approvalStatus')}</span>
          <ShieldCheck className="w-5 h-5 text-rentify-primary" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">
            {metrics.approvedCount}/{metrics.totalBuildings}
          </span>
          <span className="text-xs text-rentify-text-secondary">
            {t('list.approvedRatio', { approved: metrics.approvedCount, total: metrics.totalBuildings })}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-rentify-text-secondary text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rentify-neutral" />
          <span>
            {metrics.totalBuildings - metrics.approvedCount > 0
              ? t('list.pendingNotice', { count: metrics.totalBuildings - metrics.approvedCount })
              : t('list.allApproved')}
          </span>
        </div>
      </Card>
    </div>
  );
};

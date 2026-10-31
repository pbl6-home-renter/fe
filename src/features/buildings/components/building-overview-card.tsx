import { useTranslation } from 'react-i18next';
import {
  Building2,
  DoorOpen,
  BadgeCheck,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { BuildingStatus } from '../enums/building-status.enum';
import type { BuildingMyDetailDto } from '../types/building.dto';

interface BuildingOverviewCardProps {
  building: BuildingMyDetailDto;
}

export const BuildingOverviewCard = ({ building }: BuildingOverviewCardProps) => {
  const { t } = useTranslation('buildings');

  const isApproved = building.status === BuildingStatus.APPROVED;
  const isRejected = building.status === BuildingStatus.REJECTED;
  const occRate = Number(building.occupancyRate?.replace?.('%', '')) || 0;

  return (
    <div className="bg-rentify-surface rounded-2xl p-6 border border-rentify-divider shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rentify-text-primary">
              {t('detail.overviewTitle')}
            </h2>
            <span className="text-xs text-rentify-text-secondary">
              {t('detail.overviewSubtitle')}
            </span>
          </div>
        </div>
        <span className="text-xs text-rentify-text-secondary font-medium">
          {t('detail.createdAt', {
            date: building.createdAt ? formatDate(building.createdAt) : '---',
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('detail.occupancyRateLabel')}
            </span>
            <DoorOpen className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rentify-text-primary tracking-tight">
              {building.occupancyRate?.endsWith('%')
                ? building.occupancyRate
                : `${building.occupancyRate}%`}
            </span>
            <span className="text-xs text-rentify-text-secondary">
              {t('detail.rentedRoomsRatio', {
                occupied: building.occupiedRooms,
                total: building.totalRooms ?? 0,
              })}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-rentify-success rounded-full transition-all"
              style={{ width: `${Math.min(100, occRate)}%` }}
            />
          </div>
        </div>

        <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('detail.floorsScale', { defaultValue: 'Số tầng' })}
            </span>
            <Building2 className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-rentify-text-primary tracking-tight">
              {building.totalFloors ?? '—'}
            </span>
            {building.totalFloors && (
              <span className="text-xs font-semibold text-rentify-text-secondary">
                {t('detail.floorsUnit', { defaultValue: 'tầng' })}
              </span>
            )}
          </div>
          <div className="text-xs text-rentify-text-secondary">
            {t('detail.multiFloorScale')}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rentify-primary-container/20 flex items-center justify-center text-rentify-primary">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-rentify-text-secondary">{t('detail.statusLabel')}</span>
            <span className="text-xs font-semibold text-rentify-text-primary">
              {isApproved
                ? t('status.approved')
                : isRejected
                ? t('status.rejected')
                : t('status.pending')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-rentify-text-secondary">
          <Calendar className="w-4 h-4 text-rentify-text-secondary" />
          <span>{t('detail.lastUpdated', { date: formatDate(building.createdAt) })}</span>
        </div>
      </div>
    </div>
  );
};

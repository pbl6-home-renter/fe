import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import type { RoomsByStatusDto } from '../../types/admin-dashboard.dto';

export interface AdminRoomDistributionChartProps {
  totalRooms: number;
  roomsByStatus: RoomsByStatusDto;
}

export const AdminRoomDistributionChart = ({ totalRooms, roomsByStatus }: AdminRoomDistributionChartProps) => {
  const { t } = useTranslation('dashboard');

  const { available, occupied, maintenance } = roomsByStatus;

  const availablePct = totalRooms > 0 ? Math.round((available / totalRooms) * 100) : 0;
  const occupiedPct = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;
  const maintenancePct = totalRooms > 0 ? Math.max(0, 100 - availablePct - occupiedPct) : 0;

  return (
    <Card className="p-5 sm:p-6 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-rentify-text-primary tracking-tight">
            {t('admin.roomDistribution')}
          </h3>
          <p className="text-xs text-rentify-text-secondary mt-0.5">{t('admin.roomDistributionDesc')}</p>
        </div>
        <span className="text-xs font-semibold text-rentify-primary bg-primary-container/20 px-3 py-1 rounded-full">
          {t('admin.totalRoomsCount', { count: totalRooms })}
        </span>
      </div>

      {totalRooms === 0 ? (
        <div className="py-8 text-center text-xs text-rentify-text-secondary">{t('admin.noRoomsYet')}</div>
      ) : (
        <>
          {/* Stacked Progress Bar */}
          <div
            className="h-3.5 w-full bg-rentify-background rounded-full overflow-hidden flex shadow-inner"
            role="progressbar"
            aria-label={t('admin.roomDistribution')}
            aria-valuenow={occupiedPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {occupiedPct > 0 && (
              <div
                className="bg-rentify-primary h-full transition-all duration-300"
                style={{ width: `${occupiedPct}%` }}
                title={`${t('admin.roomOccupied')}: ${occupied} (${occupiedPct}%)`}
              />
            )}
            {availablePct > 0 && (
              <div
                className="bg-rentify-success h-full transition-all duration-300"
                style={{ width: `${availablePct}%` }}
                title={`${t('admin.roomAvailable')}: ${available} (${availablePct}%)`}
              />
            )}
            {maintenancePct > 0 && (
              <div
                className="bg-rentify-warning h-full transition-all duration-300"
                style={{ width: `${maintenancePct}%` }}
                title={`${t('admin.roomMaintenance')}: ${maintenance} (${maintenancePct}%)`}
              />
            )}
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-rentify-divider/50">
            {/* 1. Đang thuê */}
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rentify-primary shrink-0 shadow-xs" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-rentify-text-secondary">{t('admin.roomOccupied')}</span>
                <span className="text-base font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
                  {occupied} <span className="text-xs font-medium text-rentify-text-secondary">({occupiedPct}%)</span>
                </span>
              </div>
            </div>

            {/* 2. Phòng trống */}
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rentify-success shrink-0 shadow-xs" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-rentify-text-secondary">{t('admin.roomAvailable')}</span>
                <span className="text-base font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
                  {available} <span className="text-xs font-medium text-rentify-text-secondary">({availablePct}%)</span>
                </span>
              </div>
            </div>

            {/* 3. Bảo trì */}
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rentify-warning shrink-0 shadow-xs" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-rentify-text-secondary">{t('admin.roomMaintenance')}</span>
                <span className="text-base font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
                  {maintenance}{' '}
                  <span className="text-xs font-medium text-rentify-text-secondary">({maintenancePct}%)</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

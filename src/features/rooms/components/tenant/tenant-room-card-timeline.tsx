import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { calculateContractTimeline } from '../../utils/contract-timeline';

export interface TenantRoomCardTimelineProps {
  startDate: string;
  endDate: string;
}

export const TenantRoomCardTimeline = ({ startDate, endDate }: TenantRoomCardTimelineProps) => {
  const { t } = useTranslation('rooms');
  const timeline = calculateContractTimeline(startDate, endDate);

  return (
    <div className="rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/60 p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-semibold text-rentify-text-primary">
          <Calendar className="h-4 w-4 text-rentify-primary" />
          <span>{t('tenantRoom.contractTimelineTitle')}</span>
        </div>
        <span className="font-mono text-xs text-rentify-text-secondary">
          {formatDate(startDate)} — {formatDate(endDate)}
        </span>
      </div>

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
  );
};

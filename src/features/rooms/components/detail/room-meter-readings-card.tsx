import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Card } from '@/components/ui/card';
import { MeterType } from '@/features/meter-readings/enums/meter-type.enum';
import { useRoomLatestMeterReading } from '../../hooks/use-room-latest-meter-reading';
import { formatDateTime, formatMonth } from '@/lib/utils/format';

export const RoomMeterReadingsCard = ({ roomId }: { roomId: string }) => {
  const { t } = useTranslation('rooms');
  const electricity = useRoomLatestMeterReading(roomId, MeterType.ELECTRICITY);
  const water = useRoomLatestMeterReading(roomId, MeterType.WATER);
  const readings = [
    { label: t('detail.electricity'), unit: t('units.kwh'), query: electricity },
    { label: t('detail.water'), unit: t('units.m3'), query: water },
  ];
  return (
    <Card className="space-y-4">
      <h3 className="font-bold text-base text-rentify-text-primary">{t('detail.meterTitle')}</h3>
      <p className="text-xs text-rentify-text-secondary">{t('detail.meterPageNote')}</p>
      {readings.map(({ label, unit, query }) => {
        const reading = query.data;
        return (
          <div key={label} className="space-y-2 rounded-xl bg-surface-container-low p-3">
            <h4 className="text-sm font-semibold">{label}</h4>
            {query.isLoading ? <Skeleton className="h-10 w-full" /> : query.isError ? <ErrorState onRetry={() => void query.refetch()} /> : reading ? (
              <>
                <p className="font-semibold tabular-nums">{reading.currentReading} {unit}</p>
                <p className="text-xs text-rentify-text-secondary">{t('detail.meterPeriod', { period: formatMonth(reading.period) })}</p>
                {reading.createdAt && <p className="text-xs text-rentify-text-secondary">{t('detail.meterRecordedAt', { date: formatDateTime(reading.createdAt) })}</p>}
              </>
            ) : <p className="text-sm text-rentify-text-secondary">{t('detail.noMetersRecorded')}</p>}
          </div>
        );
      })}
    </Card>
  );
};

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplet, Gauge } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';

interface RoomMeterReadingsCardProps {
  meterReadings?: {
    electricity?: string | null;
    water?: string | null;
    recordedAt?: string | null;
  } | null;
  buildingId?: string;
}

export const RoomMeterReadingsCard = ({ meterReadings, buildingId }: RoomMeterReadingsCardProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const hasReadings = Boolean(meterReadings && (meterReadings.electricity || meterReadings.water));

  const handleGoToMeterReadings = () => {
    const url = buildingId
      ? `${ROUTES.LANDLORD.METER_READINGS}?buildingId=${buildingId}`
      : ROUTES.LANDLORD.METER_READINGS;
    navigate(url);
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-rentify-divider">
        <h4 className="font-bold text-base text-rentify-text-primary">{t('detail.meterTitle')}</h4>
        {hasReadings && meterReadings?.recordedAt && (
          <span className="text-[11px] text-rentify-text-secondary">
            {new Date(meterReadings.recordedAt).toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>

      {hasReadings ? (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
            <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-rentify-warning" />
              <span>{t('detail.electricity')}</span>
            </span>
            <p className="font-bold text-sm text-rentify-text-primary font-mono">
              {meterReadings?.electricity || '—'}{' '}
              <span className="text-[11px] font-normal text-rentify-text-secondary">{t('units.kwh')}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
            <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
              <Droplet className="w-3.5 h-3.5 text-rentify-primary" />
              <span>{t('detail.water')}</span>
            </span>
            <p className="font-bold text-sm text-rentify-text-primary font-mono">
              {meterReadings?.water || '—'}{' '}
              <span className="text-[11px] font-normal text-rentify-text-secondary">{t('units.m3')}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="py-2 space-y-3">
          <p className="text-xs text-rentify-text-secondary">{t('detail.noMetersRecorded')}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGoToMeterReadings}
            className="w-full gap-2 text-xs"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{t('detail.recordMetersAction')}</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Layers, Square, DollarSign, ShieldCheck, Users, Sparkles } from 'lucide-react';
import type { RoomDetailDto } from '../../types/room.dto';

interface RoomSpecsCardProps {
  room: RoomDetailDto;
}

export const RoomSpecsCard = ({ room }: RoomSpecsCardProps) => {
  const { t } = useTranslation('rooms');

  const formatPrice = (val?: number) =>
    val !== undefined
      ? `${new Intl.NumberFormat('vi-VN').format(val)} ${t('units.currency')}`
      : '—';

  return (
    <Card className="p-6 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-5">
      <div className="pb-3 border-b border-rentify-divider">
        <h3 className="font-bold text-base text-rentify-text-primary">
          {t('detail.specsTitle')}
        </h3>
        <p className="text-xs text-rentify-text-secondary">
          {t('detail.specsSubtitle')}
        </p>
      </div>

      {/* Grid of specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <DollarSign className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.rentPrice')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-primary">
            {formatPrice(room.rentPrice)}
            <span className="text-[11px] font-normal text-rentify-text-secondary ml-1">
              {t('units.monthSuffix')}
            </span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.depositAmount')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-text-primary">
            {formatPrice(room.depositAmount)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <Square className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.area')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-text-primary">
            {room.area ? `${room.area} ${t('units.area')}` : '—'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.floorNumber')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-text-primary">
            {room.floorNumber ? t('floorDisplay', { floor: room.floorNumber }) : '—'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <Users className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.maxOccupancy')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-text-primary">
            {room.maxOccupancy
              ? t('units.people', { count: room.maxOccupancy})
              : t('form.unlimited')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/70 space-y-1">
          <span className="text-rentify-text-secondary flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-rentify-primary" />
            <span>{t('form.genderPolicy')}</span>
          </span>
          <p className="font-bold text-sm text-rentify-text-primary">
            {t(`gender.${room.genderPolicy}` as never)}
          </p>
        </div>
      </div>

      {/* Description */}
      {room.description && (
        <div className="pt-2 border-t border-rentify-divider space-y-1.5">
          <h4 className="font-semibold text-xs text-rentify-text-primary">
            {t('form.description')}
          </h4>
          <p className="text-xs text-rentify-text-secondary leading-relaxed bg-surface-container-low/50 p-3 rounded-xl">
            {room.description}
          </p>
        </div>
      )}

      {/* Amenities */}
      {room.amenities && Object.keys(room.amenities).length > 0 && (
        <div className="pt-2 border-t border-rentify-divider space-y-2">
          <h4 className="font-semibold text-xs text-rentify-text-primary">
            {t('form.amenitiesTitle')}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(room.amenities).map(([key, val]) =>
              val ? (
                <span
                  key={key}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-low text-rentify-text-primary text-xs font-medium"
                >
                  {t(`amenities.${key}` as never)}
                </span>
              ) : null
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

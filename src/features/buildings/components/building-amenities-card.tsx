import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

interface BuildingAmenitiesCardProps {
  amenities?: Record<string, unknown> | null;
}

export const BuildingAmenitiesCard = ({ amenities }: BuildingAmenitiesCardProps) => {
  const { t } = useTranslation('buildings');

  const hasAnyAmenity = Boolean(amenities && Object.values(amenities).some(Boolean));

  return (
    <div className="bg-rentify-surface rounded-2xl p-6 border border-rentify-divider shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <h3 className="text-sm font-bold text-rentify-text-primary">{t('detail.amenitiesTitle')}</h3>
        <Sparkles className="w-4 h-4 text-rentify-primary" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Boolean(amenities?.elevator) && (
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-low text-rentify-text-primary text-xs font-semibold">
            {t('amenities.elevator')}
          </span>
        )}
        {Boolean(amenities?.parking) && (
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-low text-rentify-text-primary text-xs font-semibold">
            {t('amenities.parking')}
          </span>
        )}
        {Boolean(amenities?.securityCamera) && (
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-low text-rentify-text-primary text-xs font-semibold">
            {t('amenities.securityCamera')}
          </span>
        )}
        {Boolean(amenities?.fingerprintLock) && (
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-low text-rentify-text-primary text-xs font-semibold">
            {t('amenities.fingerprintLock')}
          </span>
        )}
        {!hasAnyAmenity && (
          <span className="text-xs text-rentify-text-secondary">{t('detail.noAmenities')}</span>
        )}
      </div>
    </div>
  );
};

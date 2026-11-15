import { useTranslation } from 'react-i18next';
import { Armchair, Bath, Flame, Home, Layers, Maximize2, Refrigerator, Shield, Users, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { RoomDetailDto } from '../../types/room.dto';

export interface RoomPublicInfoProps {
  room: RoomDetailDto;
  genderLabel: string;
}

export const RoomPublicInfo = ({ room, genderLabel }: RoomPublicInfoProps) => {
  const { t } = useTranslation('rooms');
  const amenities = room.amenities;

  const amenityItems = [
    { key: 'aircon', label: t('amenities.aircon'), active: Boolean(amenities?.aircon), icon: Wind },
    { key: 'fridge', label: t('amenities.fridge'), active: Boolean(amenities?.fridge), icon: Refrigerator },
    { key: 'wcInside', label: t('amenities.wcInside'), active: Boolean(amenities?.wcInside), icon: Bath },
    { key: 'waterHeater', label: t('amenities.waterHeater'), active: Boolean(amenities?.waterHeater), icon: Flame },
    { key: 'mezzanine', label: t('amenities.mezzanine'), active: Boolean(amenities?.mezzanine), icon: Maximize2 },
    {
      key: 'tableChair',
      label: `${t('amenities.table')} & ${t('amenities.chair')}`,
      active: Boolean(amenities?.table || amenities?.chair),
      icon: Armchair,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Room Specifications Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 flex flex-col gap-1">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('detail.specs.area')}</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-rentify-text-primary">
            <Layers className="h-4 w-4 text-rentify-primary" />
            <span>{room.area ? `${room.area} m²` : t('detail.specs.updating')}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 flex flex-col gap-1">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('detail.specs.floor')}</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-rentify-text-primary">
            <Home className="h-4 w-4 text-rentify-primary" />
            <span>
              {room.floorNumber ? `${t('detail.specs.floor')} ${room.floorNumber}` : t('detail.specs.groundFloor')}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 flex flex-col gap-1">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('detail.specs.occupancy')}</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-rentify-text-primary">
            <Users className="h-4 w-4 text-rentify-primary" />
            <span>
              {room.maxOccupancy
                ? `${room.maxOccupancy} ${t('units.people', { count: room.maxOccupancy })}`
                : t('detail.specs.unlimited')}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 flex flex-col gap-1">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('detail.specs.genderPolicy')}</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-rentify-text-primary">
            <Shield className="h-4 w-4 text-rentify-primary" />
            <span className="truncate">{genderLabel}</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <Card className="p-6 rounded-2xl space-y-3 bg-rentify-card border border-rentify-divider">
        <h3 className="text-base font-bold text-rentify-text-primary">{t('detail.descriptionTitle')}</h3>
        <p className="text-xs sm:text-sm text-rentify-text-secondary leading-relaxed whitespace-pre-line">
          {room.description || t('detail.specs.updating')}
        </p>
      </Card>

      {/* Amenities & Equipments Card */}
      <Card className="p-6 rounded-2xl space-y-4 bg-rentify-card border border-rentify-divider">
        <h3 className="text-base font-bold text-rentify-text-primary">{t('detail.amenitiesTitle')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          {amenityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  item.active
                    ? 'border-rentify-primary/40 bg-rentify-primary-container/10 text-rentify-primary font-semibold'
                    : 'border-rentify-divider text-rentify-outline opacity-50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, Layers, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BuildingStatusBadge } from '@/features/buildings/components/building-status-badge';
import { ROUTES } from '@/config/routes.config';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';

export interface LandlordBuildingCardProps {
  building: BuildingMyListItemDto;
}

export const LandlordBuildingCard = ({ building }: LandlordBuildingCardProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Link
      to={ROUTES.LANDLORD.BUILDING_DETAIL(building.id)}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
    >
      <Card
        variant="interactive"
        className="flex h-full flex-col justify-between gap-4 p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs hover:border-rentify-primary/40 hover:shadow-card transition-all"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rentify-background border border-rentify-divider text-rentify-primary flex items-center justify-center shrink-0 group-hover:border-rentify-primary/40 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                  {building.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-rentify-outline" />
                  <span className="truncate">{building.address || t('full.unspecifiedAddress')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-rentify-divider flex items-center justify-between">
            <BuildingStatusBadge status={building.status} variant="pill" />

            {building.occupancyRate && (
              <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary font-medium">
                <Layers className="w-3.5 h-3.5 text-rentify-text-secondary" />
                <span>{building.occupancyRate}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-rentify-divider flex items-center justify-between text-xs">
          <span className="text-rentify-text-secondary font-medium">
            {building.occupiedRooms !== undefined ? t('full.occupiedRooms', { count: building.occupiedRooms }) : ''}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-rentify-primary group-hover:underline">
            <span>{t('full.viewDetail')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};

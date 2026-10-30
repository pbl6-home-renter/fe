import { useTranslation } from 'react-i18next';
import { MapPin, Share2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingMyDetailDto } from '../types/building.dto';

interface BuildingDetailHeaderProps {
  building: BuildingMyDetailDto;
  onEdit: () => void;
  onDelete: () => void;
}

export const BuildingDetailHeader = ({
  building,
  onEdit,
  onDelete,
}: BuildingDetailHeaderProps) => {
  const { t } = useTranslation('buildings');

  const fullAddress = [
    building.address,
    building.ward,
    building.district,
    building.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-rentify-surface rounded-2xl p-6 border border-rentify-divider shadow-xs flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-rentify-text-primary tracking-tight">
              {building.name}
            </h1>
            <BuildingStatusBadge status={building.status} variant="pill" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <MapPin className="w-4 h-4 text-rentify-primary shrink-0" />
            <span>{fullAddress || t('detail.unspecifiedAddress')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            className="h-10 px-3.5 rounded-xl bg-surface-container-low border border-rentify-divider text-rentify-text-primary hover:bg-surface-container text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-rentify-text-secondary" />
            <span>{t('detail.shareProfile')}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 h-10 px-4 rounded-xl font-semibold text-xs"
          >
            <Pencil className="w-3.5 h-3.5 text-rentify-text-secondary" />
            <span>{t('edit.title')}</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="gap-2 h-10 px-4 rounded-xl font-semibold text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('delete.title')}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-rentify-divider">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-container-low text-rentify-text-primary text-xs font-medium">
          {building.totalFloors
            ? t('detail.floorsCount', { count: building.totalFloors })
            : t('detail.multiFloorScale')}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-container-low text-rentify-text-primary text-xs font-medium">
          {t('detail.roomsCount', { count: building.totalRooms ?? 0 })}
        </span>
      </div>
    </div>
  );
};

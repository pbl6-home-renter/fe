import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Row } from '@tanstack/react-table';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingMyListItemDto } from '../types/building.dto';

export const BuildingListMobileRow = ({ row }: { row: Row<BuildingMyListItemDto> }) => {
  const { t } = useTranslation('buildings');
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-rentify-text-primary">{row.original.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-rentify-text-secondary">{row.original.address || '—'}</p>
          </div>
        </div>
        <BuildingStatusBadge status={row.original.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
        <span>{t('list.rooms', { count: row.original.totalRooms ?? 0 })}</span>
        <span className="font-semibold tabular-nums">{t('list.occupancyValue', { value: row.original.occupancyRate })}</span>
      </div>
    </div>
  );
};


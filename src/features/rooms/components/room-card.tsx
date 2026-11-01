import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RoomStatusBadge } from './room-status-badge';
import type { RoomMyListItemDto } from '../types/room.dto';

interface RoomCardProps {
  room: RoomMyListItemDto;
  buildingId?: string;
}

export const RoomCard = ({ room, buildingId }: RoomCardProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const effectiveBuildingId = buildingId || room.buildingId;
  const detailUrl = effectiveBuildingId
    ? `/buildings/${effectiveBuildingId}/rooms/${room.id}`
    : `/rooms/${room.id}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  return (
    <Card
      onClick={() => navigate(detailUrl)}
      className="p-4 hover:border-rentify-primary hover:shadow-md transition-all cursor-pointer bg-rentify-surface rounded-xl border border-rentify-divider flex flex-col justify-between gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
              {room.name}
            </h4>
            {room.activeIssuesCount > 0 && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rentify-error bg-rentify-error/10 border border-rentify-error/20 px-1.5 py-0.5 rounded-md"
                title={t('activeIssuesTooltip', {
                  count: room.activeIssuesCount,
                  })}
              >
                <AlertCircle className="w-3 h-3" />
                <span>{room.activeIssuesCount}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {room.floorNumber ? t('floorDisplay', { floor: room.floorNumber}) : null}
            {room.floorNumber && room.area ? ' • ' : ''}
            {room.area ? `${room.area} ${t('units.area')}` : null}
          </p>
        </div>

        <RoomStatusBadge status={room.status} />
      </div>

      <div className="pt-2 border-t border-rentify-divider/60 flex items-center justify-between text-xs">
        <div className="font-bold text-rentify-primary text-sm">
          {formatPrice(room.rentPrice)}
          <span className="text-[11px] font-normal text-rentify-text-secondary ml-1">
            {t('units.perMonth')}
          </span>
        </div>

        {room.currentTenantName ? (
          <div className="flex items-center gap-1 text-rentify-text-secondary text-[11px] truncate max-w-[140px]">
            <User className="w-3 h-3 shrink-0" />
            <span className="truncate">{room.currentTenantName}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

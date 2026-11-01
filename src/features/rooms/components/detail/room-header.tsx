import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomStatusBadge } from '../room-status-badge';
import { RoomStatus } from '../../enums/room-status.enum';
import type { RoomDetailDto } from '../../types/room.dto';

interface RoomHeaderProps {
  room: RoomDetailDto;
  onEdit: () => void;
  onDelete: () => void;
  onMarkReady: () => void;
  isMarkingReady: boolean;
}

export const RoomHeader = ({
  room,
  onEdit,
  onDelete,
  onMarkReady,
  isMarkingReady,
}: RoomHeaderProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const canMarkReady =
    room.status === RoomStatus.CLEANING ||
    room.status === RoomStatus.MAINTENANCE ||
    room.status === RoomStatus.PENDING_CLEANUP;

  const handleBack = () => {
    navigate(`/buildings/${room.buildingId}`);
  };

  return (
    <div className="space-y-4">
      {/* Top back button */}
      <div className="flex items-center gap-2 text-xs text-rentify-text-secondary">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 hover:text-rentify-primary transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.backToBuilding', { building: room.buildingName })}</span>
        </button>
      </div>

      {/* Main Bar */}
      <div className="bg-rentify-surface p-5 rounded-2xl border border-rentify-divider shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-bold text-xl text-rentify-text-primary tracking-tight truncate">
              {room.name}
            </h1>
            <RoomStatusBadge status={room.status} />
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {room.buildingName}
            {room.floorNumber ? ` • ${t('floorDisplay', { floor: room.floorNumber })}` : ''}
            {room.area ? ` • ${room.area} ${t('units.area')}` : ''}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {canMarkReady && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onMarkReady}
              isLoading={isMarkingReady}
              className="text-rentify-success border-rentify-success/30 hover:bg-rentify-success/10"
            >
              <CheckCircle2 className="w-4 h-4 mr-1 text-rentify-success" />
              <span>{t('detail.markReadyAction')}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t('detail.editAction')}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-rentify-error border-rentify-error/30 hover:bg-rentify-error/10 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('detail.deleteAction')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { RoomStatus } from '../enums/room-status.enum';
import { ROOM_STATUS_CONFIG } from '../constants/room.constants';
import { cn } from '@/lib/utils/cn';

interface RoomStatusBadgeProps {
  status: RoomStatus | string;
  showDotOnly?: boolean;
  className?: string;
}

export const RoomStatusBadge = ({
  status,
  showDotOnly = false,
  className,
}: RoomStatusBadgeProps) => {
  const { t } = useTranslation('rooms');
  const validStatus = Object.values(RoomStatus).includes(status as RoomStatus)
    ? (status as RoomStatus)
    : RoomStatus.AVAILABLE;

  const config = ROOM_STATUS_CONFIG[validStatus];
  const label = t(config.labelKey);

  if (showDotOnly) {
    return (
      <span
        className={cn('inline-block w-2 h-2 rounded-full', config.dotClass, className)}
        title={label}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-low text-rentify-text-primary',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} />
      <span>{label}</span>
    </span>
  );
};

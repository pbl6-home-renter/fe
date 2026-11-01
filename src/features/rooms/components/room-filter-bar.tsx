import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { RoomStatus } from '../enums/room-status.enum';
import { ROOM_STATUS_CONFIG } from '../constants/room.constants';
import { cn } from '@/lib/utils/cn';

interface RoomFilterBarProps {
  selectedFloor: number | 'all';
  onSelectFloor: (floor: number | 'all') => void;
  availableFloors: number[];
  selectedStatus: RoomStatus | 'all';
  onSelectStatus: (status: RoomStatus | 'all') => void;
}

export const RoomFilterBar = ({
  selectedFloor,
  onSelectFloor,
  availableFloors,
  selectedStatus,
  onSelectStatus,
}: RoomFilterBarProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-rentify-surface px-4 py-3 rounded-xl border border-rentify-divider text-xs">
      {/* Floor Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-rentify-text-secondary font-medium mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('list.floorFilter')}</span>
        </span>
        <button
          type="button"
          onClick={() => onSelectFloor('all')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
            selectedFloor === 'all'
              ? 'bg-rentify-primary text-white shadow-xs'
              : 'bg-surface-container-low text-rentify-text-secondary hover:text-rentify-text-primary'
          )}
        >
          {t('list.allFloors')}
        </button>
        {availableFloors.map((floor) => (
          <button
            key={floor}
            type="button"
            onClick={() => onSelectFloor(floor)}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
              selectedFloor === floor
                ? 'bg-rentify-primary text-white shadow-xs'
                : 'bg-surface-container-low text-rentify-text-secondary hover:text-rentify-text-primary'
            )}
          >
            {t('floorDisplay', { floor})}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="w-48">
        <SelectDropdown
          value={selectedStatus}
          onChange={(e) => onSelectStatus(e.target.value as RoomStatus | 'all')}
          options={[
            { value: 'all', label: t('status.allStatuses') },
            ...Object.entries(ROOM_STATUS_CONFIG).map(([st, cfg]) => ({
              value: st,
              label: t(cfg.labelKey),
            })),
          ]}
        />
      </div>
    </div>
  );
};

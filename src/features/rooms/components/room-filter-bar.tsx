import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Card } from '@/components/ui/card';
import { RoomStatus } from '../enums/room-status.enum';
import { ROOM_STATUS_CONFIG } from '../constants/room.constants';

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
    <Card variant="flat" className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs">
      {/* Floor Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-rentify-text-secondary font-medium mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('list.floorFilter')}</span>
        </span>
        <SegmentedControl<number | 'all'>
          label={t('list.floorFilter')}
          value={selectedFloor}
          onChange={onSelectFloor}
          className="max-w-full overflow-x-auto"
          options={[
            { value: 'all', label: t('list.allFloors') },
            ...availableFloors.map((floor) => ({ value: floor, label: t('floorDisplay', { floor }) })),
          ]}
        />
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
    </Card>
  );
};

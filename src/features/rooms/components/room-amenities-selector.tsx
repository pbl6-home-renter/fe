import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { SUPPORTED_ROOM_AMENITIES } from '../constants/room.constants';

interface RoomAmenitiesSelectorProps {
  values?: Record<string, boolean | undefined>;
  onChange: (key: string, checked: boolean) => void;
}

export const RoomAmenitiesSelector = ({
  values = {},
  onChange,
}: RoomAmenitiesSelectorProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div>
      <label className="block text-xs font-semibold text-rentify-text-primary mb-2">
        {t('form.amenitiesTitle')}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {SUPPORTED_ROOM_AMENITIES.map((amenity) => (
          <label
            key={amenity}
            className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors cursor-pointer text-xs"
          >
            <Checkbox
              checked={Boolean(values[amenity])}
              onChange={(e) => onChange(amenity, e.target.checked)}
            />
            <span className="text-rentify-text-primary">
              {t(`amenities.${amenity}` as never)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

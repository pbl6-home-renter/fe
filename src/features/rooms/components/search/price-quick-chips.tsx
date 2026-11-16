import { useTranslation } from 'react-i18next';
import { PRICE_QUICK_CHIPS, type PriceQuickChip } from '../../constants/search.constants';

export interface PriceQuickChipsProps {
  activeChipId?: string;
  onSelect: (chip: PriceQuickChip) => void;
}

export const PriceQuickChips = ({ activeChipId, onSelect }: PriceQuickChipsProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
      {PRICE_QUICK_CHIPS.map((chip) => {
        const isSelected = chip.id === activeChipId;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelect(chip)}
            className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
              isSelected
                ? 'border-rentify-primary bg-rentify-primary text-white shadow-xs'
                : 'border-rentify-divider bg-rentify-surface text-rentify-text-secondary hover:border-rentify-primary/40'
            }`}
          >
            {t(chip.labelKey)}
          </button>
        );
      })}
    </div>
  );
};

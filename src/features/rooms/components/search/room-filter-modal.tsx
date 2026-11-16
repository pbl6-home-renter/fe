import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import {
  MAX_SEARCH_PRICE,
  MIN_SEARCH_PRICE,
  PRICE_QUICK_CHIPS,
  SEARCH_PRICE_STEP,
  type PriceQuickChip,
} from '../../constants/search.constants';
import { DualRangeSlider } from './dual-range-slider';
import { PriceQuickChips } from './price-quick-chips';
import type { RoomSearchFiltersState } from '../../hooks/use-room-search';

export interface RoomFilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: RoomSearchFiltersState;
  onApply: (nextFilters: RoomSearchFiltersState) => void;
  onReset: () => void;
}

export const RoomFilterModal = (props: RoomFilterModalProps) => {
  if (!props.open) return null;
  return <RoomFilterModalDialog {...props} />;
};

const RoomFilterModalDialog = ({ open, onClose, filters, onApply, onReset }: RoomFilterModalProps) => {
  const { t } = useTranslation('rooms');

  const [province, setProvince] = useState(filters.province);
  const [ward, setWard] = useState(filters.ward);
  const [minPrice, setMinPrice] = useState(filters.minPrice ? Number(filters.minPrice) : MIN_SEARCH_PRICE);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ? Number(filters.maxPrice) : MAX_SEARCH_PRICE);
  const [genderPolicy, setGenderPolicy] = useState(filters.genderPolicy);

  const activeQuickChipId = PRICE_QUICK_CHIPS.find((c) => c.min === minPrice && c.max === maxPrice)?.id;

  const handleSelectQuickChip = (chip: PriceQuickChip) => {
    setMinPrice(chip.min);
    setMaxPrice(chip.max);
  };

  const handleDialogReset = () => {
    setProvince('');
    setWard('');
    setMinPrice(MIN_SEARCH_PRICE);
    setMaxPrice(MAX_SEARCH_PRICE);
    setGenderPolicy('');
    onReset();
    onClose();
  };

  const handleDialogApply = () => {
    onApply({
      province,
      ward,
      district: filters.district,
      minPrice: minPrice > MIN_SEARCH_PRICE ? String(minPrice) : '',
      maxPrice: maxPrice < MAX_SEARCH_PRICE ? String(maxPrice) : '',
      genderPolicy,
    });
    onClose();
  };

  const genderOptions = [
    { value: '', label: t('search.genderAll') },
    { value: 'MALE', label: t('search.genderMale') },
    { value: 'FEMALE', label: t('search.genderFemale') },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-rentify-primary" />
          <span className="font-bold text-rentify-text-primary text-base sm:text-lg">{t('search.filterTitle')}</span>
        </div>
      }
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full pt-1">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleDialogReset}
            className="text-xs text-rentify-text-secondary hover:text-rentify-error"
          >
            {t('search.resetAction')}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleDialogApply}
            className="h-12 px-6 rounded-2xl text-xs font-bold shadow-xs"
          >
            {t('search.applyAction')}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* 1. Location Cascading Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-rentify-text-primary uppercase tracking-wide">
            {t('search.locationGroup')}
          </label>
          <ProvinceWardSelect
            province={province}
            ward={ward}
            onChange={(vals) => {
              setProvince(vals.province);
              setWard(vals.ward);
            }}
            onProvinceChange={(p) => {
              setProvince(p);
              setWard('');
            }}
            onWardChange={setWard}
            provincePlaceholder={t('search.selectProvincePlaceholder')}
            wardPlaceholder={t('search.selectWardPlaceholder')}
          />
        </div>

        {/* 2. Price Range (Dual Slider + 4 Quick Chips) */}
        <div className="space-y-3 pt-1 border-t border-rentify-divider">
          <label className="text-xs font-bold text-rentify-text-primary uppercase tracking-wide block pt-2">
            {t('search.priceGroup')}
          </label>

          <DualRangeSlider
            min={MIN_SEARCH_PRICE}
            max={MAX_SEARCH_PRICE}
            step={SEARCH_PRICE_STEP}
            minValue={minPrice}
            maxValue={maxPrice}
            onChange={(nMin, nMax) => {
              setMinPrice(nMin);
              setMaxPrice(nMax);
            }}
            minLabel={t('search.fromPrice')}
            maxLabel={t('search.toPrice')}
          />

          <PriceQuickChips activeChipId={activeQuickChipId} onSelect={handleSelectQuickChip} />
        </div>

        {/* 3. Gender Segmented Control */}
        <div className="space-y-2 pt-2 border-t border-rentify-divider">
          <label className="text-xs font-bold text-rentify-text-primary uppercase tracking-wide block">
            {t('search.genderGroup')}
          </label>
          <SegmentedControl
            label={t('search.genderGroup')}
            value={genderPolicy}
            options={genderOptions}
            onChange={setGenderPolicy}
            className="w-full flex"
            itemClassName="flex-1 justify-center py-2"
          />
        </div>
      </div>
    </Dialog>
  );
};

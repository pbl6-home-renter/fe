import { useTranslation } from 'react-i18next';
import { RotateCcw, SlidersHorizontal, MapPin, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import { GENDER_POLICY_OPTIONS } from '../../constants/room.constants';
import type { RoomSearchFiltersState } from '../../hooks/use-room-search';

export interface RoomSearchFilterSidebarProps {
  draftFilters: RoomSearchFiltersState;
  hasActiveFilters: boolean;
  onDraftChange: (field: keyof RoomSearchFiltersState, value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const PRICE_PRESETS: Array<{
  labelKey: 'search.priceUnder3M' | 'search.price3Mto5M' | 'search.price5Mto8M' | 'search.priceAbove8M';
  min: string;
  max: string;
}> = [
  { labelKey: 'search.priceUnder3M', min: '', max: '3000000' },
  { labelKey: 'search.price3Mto5M', min: '3000000', max: '5000000' },
  { labelKey: 'search.price5Mto8M', min: '5000000', max: '8000000' },
  { labelKey: 'search.priceAbove8M', min: '8000000', max: '' },
];

export const RoomSearchFilterSidebar = ({
  draftFilters,
  hasActiveFilters,
  onDraftChange,
  onApply,
  onReset,
}: RoomSearchFilterSidebarProps) => {
  const { t } = useTranslation('rooms');

  const genderOptions = [
    { value: '', label: t('search.allGenders') },
    ...GENDER_POLICY_OPTIONS.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
    })),
  ];

  const handleSelectPreset = (min: string, max: string) => {
    onDraftChange('minPrice', min);
    onDraftChange('maxPrice', max);
  };

  return (
    <Card className="w-full lg:w-76 shrink-0 p-5 space-y-5 rounded-2xl bg-rentify-card border border-rentify-divider shadow-sm">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-rentify-primary" />
          <h2 className="text-sm font-bold text-rentify-text-primary">{t('search.filterTitle')}</h2>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-xs text-rentify-primary hover:text-rentify-primary-hover px-2"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('search.resetFilter')}</span>
          </Button>
        )}
      </div>

      {/* Filter 1: Khu vực / Địa điểm */}
      <div className="space-y-3 pb-4 border-b border-rentify-divider">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-rentify-primary" />
          <label className="text-xs font-semibold text-rentify-text-primary">{t('search.locationTitle')}</label>
        </div>

        <ProvinceWardSelect
          province={draftFilters.province}
          ward={draftFilters.ward}
          onChange={({ province, ward }) => {
            onDraftChange('province', province);
            onDraftChange('ward', ward);
          }}
          onProvinceChange={(province) => {
            onDraftChange('province', province);
            onDraftChange('ward', '');
          }}
          onWardChange={(ward) => onDraftChange('ward', ward)}
          provincePlaceholder={t('search.selectProvincePlaceholder')}
          wardPlaceholder={t('search.selectWardPlaceholder')}
          className="grid grid-cols-1 gap-2.5"
        />
      </div>

      {/* Filter 2: Khoảng giá */}
      <div className="space-y-3 pb-4 border-b border-rentify-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-rentify-primary" />
            <label className="text-xs font-semibold text-rentify-text-primary">{t('search.priceRange')}</label>
          </div>
          <span className="text-[11px] text-rentify-text-secondary">{t('search.priceUnit')}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label={t('search.fromPrice')}
            min={0}
            step={500000}
            value={draftFilters.minPrice ? Number(draftFilters.minPrice) : null}
            onChangeValue={(val) => onDraftChange('minPrice', val !== undefined ? String(val) : '')}
          />

          <NumberInput
            label={t('search.toPrice')}
            min={0}
            step={500000}
            value={draftFilters.maxPrice ? Number(draftFilters.maxPrice) : null}
            onChangeValue={(val) => onDraftChange('maxPrice', val !== undefined ? String(val) : '')}
          />
        </div>

        {/* Quick price presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {PRICE_PRESETS.map((preset) => {
            const isSelected = draftFilters.minPrice === preset.min && draftFilters.maxPrice === preset.max;
            return (
              <Button
                key={preset.labelKey}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSelectPreset(preset.min, preset.max)}
                className="h-7 text-[11px] px-2 font-medium"
              >
                {t(preset.labelKey)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Filter 3: Chính sách giới tính */}
      <div className="space-y-3 pb-4 border-b border-rentify-divider">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-rentify-primary" />
          <label className="text-xs font-semibold text-rentify-text-primary">{t('search.genderPolicyLabel')}</label>
        </div>

        <SelectDropdown
          value={draftFilters.genderPolicy}
          options={genderOptions}
          onChange={(e) => onDraftChange('genderPolicy', e.target.value)}
          placeholder={t('search.allGenders')}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <Button variant="primary" className="w-full text-xs font-semibold h-9 shadow-sm" onClick={onApply}>
          {t('search.applyFilter')}
        </Button>

        {hasActiveFilters && (
          <Button variant="outline" className="w-full text-xs h-9" onClick={onReset}>
            {t('search.resetFilter')}
          </Button>
        )}
      </div>
    </Card>
  );
};

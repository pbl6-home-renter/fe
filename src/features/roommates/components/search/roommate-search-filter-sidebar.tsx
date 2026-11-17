import { useTranslation } from 'react-i18next';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import { ROOMMATE_GENDER_OPTIONS } from '../../constants/roommate.constants';
import type { RoommateSearchFilterState } from '../../hooks/use-roommate-search';

export interface RoommateSearchFilterSidebarProps {
  draftFilters: RoommateSearchFilterState;
  hasActiveFilters: boolean;
  onDraftChange: (field: keyof RoommateSearchFilterState, value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const RoommateSearchFilterSidebar = ({
  draftFilters,
  hasActiveFilters,
  onDraftChange,
  onApply,
  onReset,
}: RoommateSearchFilterSidebarProps) => {
  const { t } = useTranslation('roommates');

  const genderOptions = ROOMMATE_GENDER_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));

  const handleLocationChange = (val: { province: string; ward: string }) => {
    onDraftChange('preferredProvince', val.province || '');
    onDraftChange('preferredDistrict', val.ward || '');
    onDraftChange('preferredArea', [val.ward, val.province].filter(Boolean).join(', '));
  };

  return (
    <Card className="w-full lg:w-76 shrink-0 p-5 space-y-5 rounded-2xl bg-rentify-card border border-rentify-divider shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-rentify-primary" />
          <h2 className="text-sm font-bold text-rentify-text-primary">{t('filter.title')}</h2>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-rentify-text-secondary hover:text-rentify-danger gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('filter.reset')}</span>
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-rentify-text-primary block">{t('filter.locationLabel')}</label>
        <ProvinceWardSelect
          province={draftFilters.preferredProvince}
          ward={draftFilters.preferredDistrict}
          onChange={handleLocationChange}
          onProvinceChange={(p) => {
            onDraftChange('preferredProvince', p);
            onDraftChange('preferredDistrict', '');
            onDraftChange('preferredArea', p);
          }}
          onWardChange={(w) => {
            onDraftChange('preferredDistrict', w);
            const area = [w, draftFilters.preferredProvince].filter(Boolean).join(', ');
            onDraftChange('preferredArea', area);
          }}
        />
      </div>

      <div className="space-y-2">
        <SelectDropdown
          label={t('filter.genderLabel')}
          value={draftFilters.gender}
          options={genderOptions}
          onChange={(e) => onDraftChange('gender', e.target.value)}
        />
      </div>

      <div className="pt-2">
        <Button variant="primary" size="sm" className="w-full font-bold shadow-xs" onClick={onApply}>
          {t('filter.applyAction')}
        </Button>
      </div>
    </Card>
  );
};

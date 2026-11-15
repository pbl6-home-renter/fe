import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import { ROUTES } from '@/config/routes.config';
import { GENDER_POLICY_OPTIONS } from '@/features/rooms/constants/room.constants';

export interface TenantFilterModalProps {
  open: boolean;
  onClose: () => void;
}

export const TenantFilterModal = ({ open, onClose }: TenantFilterModalProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [genderPolicy, setGenderPolicy] = useState('');

  const genderOptions = [
    { value: '', label: t('search.allGenders') },
    ...GENDER_POLICY_OPTIONS.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
    })),
  ];

  const handleApply = () => {
    onClose();
    const query = new URLSearchParams();
    if (province) query.set('province', province);
    if (ward) query.set('ward', ward);
    if (minPrice !== null) query.set('minPrice', String(minPrice));
    if (maxPrice !== null) query.set('maxPrice', String(maxPrice));
    if (genderPolicy) query.set('genderPolicy', genderPolicy);
    navigate(`${ROUTES.ROOMS_SEARCH}?${query.toString()}`);
  };

  const handleReset = () => {
    setProvince('');
    setWard('');
    setMinPrice(null);
    setMaxPrice(null);
    setGenderPolicy('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-rentify-primary" />
          <span className="font-bold text-rentify-text-primary text-base">{t('search.filterTitle')}</span>
        </div>
      }
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
            {t('search.resetFilter')}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              {t('search.cancel')}
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply} className="text-xs">
              {t('search.applyFilter')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        {/* Khu vực */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-rentify-text-primary">{t('search.locationTitle')}</label>
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

        {/* Mức giá */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-rentify-text-primary">
            {t('search.priceRange')} ({t('search.priceUnit')})
          </label>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label={t('search.fromPrice')}
              value={minPrice}
              min={0}
              step={500000}
              onChangeValue={(val) => setMinPrice(val ?? null)}
            />
            <NumberInput
              label={t('search.toPrice')}
              value={maxPrice}
              min={0}
              step={500000}
              onChangeValue={(val) => setMaxPrice(val ?? null)}
            />
          </div>
        </div>

        {/* Giới tính */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-rentify-text-primary">{t('search.genderPolicyLabel')}</label>
          <SelectDropdown
            value={genderPolicy}
            options={genderOptions}
            onChange={(e) => setGenderPolicy(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
};

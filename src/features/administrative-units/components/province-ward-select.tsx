import { SelectDropdown } from '@/components/ui/select-dropdown';
import { useProvinceWardSelect } from '../hooks/use-province-ward-select';

export interface ProvinceWardSelectProps {
  province?: string;
  ward?: string;
  onChange?: (values: { province: string; ward: string }) => void;
  onProvinceChange?: (province: string) => void;
  onWardChange?: (ward: string) => void;
  provinceError?: string;
  wardError?: string;
  disabled?: boolean;
  isLocked?: boolean;
  className?: string;
  provinceLabel?: string;
  wardLabel?: string;
  provincePlaceholder?: string;
  wardPlaceholder?: string;
}

export const ProvinceWardSelect = ({
  province,
  ward,
  onChange,
  onProvinceChange,
  onWardChange,
  provinceError,
  wardError,
  disabled = false,
  isLocked = false,
  className = 'grid grid-cols-1 md:grid-cols-2 gap-4',
  provinceLabel,
  wardLabel,
  provincePlaceholder,
  wardPlaceholder,
}: ProvinceWardSelectProps) => {
  const {
    provinceOptions,
    wardOptions,
    selectedProvince,
    isProvincesLoading,
    isWardsLoading,
    handleProvinceChange,
    handleWardChange,
    resolvedProvinceLabel,
    resolvedWardLabel,
    resolvedProvincePlaceholder,
    resolvedWardPlaceholder,
  } = useProvinceWardSelect({
    province,
    ward,
    onChange,
    onProvinceChange,
    onWardChange,
    provinceLabel,
    wardLabel,
    provincePlaceholder,
    wardPlaceholder,
  });

  return (
    <div className={className}>
      <SelectDropdown
        label={resolvedProvinceLabel}
        placeholder={resolvedProvincePlaceholder}
        options={provinceOptions}
        value={province}
        disabled={disabled || isLocked || isProvincesLoading}
        error={provinceError}
        onChange={handleProvinceChange}
      />

      <SelectDropdown
        label={resolvedWardLabel}
        placeholder={resolvedWardPlaceholder}
        options={wardOptions}
        value={ward}
        disabled={disabled || isLocked || !selectedProvince || isWardsLoading}
        error={wardError}
        onChange={handleWardChange}
      />
    </div>
  );
};

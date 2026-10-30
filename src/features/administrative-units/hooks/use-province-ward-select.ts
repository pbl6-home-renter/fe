import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SelectOption } from '@/components/ui/select-dropdown';
import {
  useProvincesQuery,
  useWardsQuery,
} from './use-administrative-units';

export interface UseProvinceWardSelectParams {
  province?: string;
  ward?: string;
  onChange?: (values: { province: string; ward: string }) => void;
  onProvinceChange?: (province: string) => void;
  onWardChange?: (ward: string) => void;
  provinceLabel?: string;
  wardLabel?: string;
  provincePlaceholder?: string;
  wardPlaceholder?: string;
}

export const useProvinceWardSelect = ({
  province,
  ward,
  onChange,
  onProvinceChange,
  onWardChange,
  provinceLabel,
  wardLabel,
  provincePlaceholder,
  wardPlaceholder,
}: UseProvinceWardSelectParams) => {
  const { t } = useTranslation();

  const { data: provinces = [], isLoading: isProvincesLoading } = useProvincesQuery();

  const selectedProvince = useMemo(
    () => provinces.find((p) => p.name === province),
    [provinces, province]
  );

  const { data: wards = [], isLoading: isWardsLoading } = useWardsQuery(selectedProvince?.code);

  const provinceOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = provinces.map((p) => ({ value: p.name, label: p.name }));
    if (province && !provinces.some((p) => p.name === province)) {
      list.unshift({ value: province, label: province });
    }
    return list;
  }, [provinces, province]);

  const wardOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = wards.map((w) => ({ value: w.name, label: w.name }));
    if (ward && !wards.some((w) => w.name === ward)) {
      list.unshift({ value: ward, label: ward });
    }
    return list;
  }, [wards, ward]);

  const handleProvinceChange = (e: { target: { value: string } }) => {
    const nextProvince = e.target.value;
    onProvinceChange?.(nextProvince);
    onWardChange?.('');
    onChange?.({ province: nextProvince, ward: '' });
  };

  const handleWardChange = (e: { target: { value: string } }) => {
    const nextWard = e.target.value;
    onWardChange?.(nextWard);
    onChange?.({ province: province ?? '', ward: nextWard });
  };

  const resolvedProvinceLabel = provinceLabel ?? t('administrativeUnits.province');
  const resolvedWardLabel = wardLabel ?? t('administrativeUnits.ward');

  const resolvedProvincePlaceholder =
    provincePlaceholder ??
    (isProvincesLoading
      ? t('administrativeUnits.loadingProvinces')
      : t('administrativeUnits.selectProvince'));

  const resolvedWardPlaceholder =
    wardPlaceholder ??
    (!selectedProvince
      ? t('administrativeUnits.selectProvinceFirst')
      : isWardsLoading
        ? t('administrativeUnits.loadingWards')
        : t('administrativeUnits.selectWard'));

  return {
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
  };
};

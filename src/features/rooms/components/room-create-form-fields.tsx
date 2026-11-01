import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { RoomAmenitiesSelector } from './room-amenities-selector';
import { getFieldError } from '@/lib/form';
import { GENDER_POLICY_OPTIONS } from '../constants/room.constants';
import type { RoomCreateFormData } from '../forms/room.schema';
import type { GenderPolicy } from '../enums/gender-policy.enum';

interface RoomCreateFormFieldsProps {
  form: UseFormReturn<RoomCreateFormData>;
}

export const RoomCreateFormFields = ({ form }: RoomCreateFormFieldsProps) => {
  const { t } = useTranslation('rooms');
  const { register, formState: { errors }, watch, setValue } = form;

  const handleDepositMatchPrice = () => {
    const rentPrice = watch('rentPrice');
    if (rentPrice) setValue('depositAmount', rentPrice);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('form.name')}
          placeholder={t('form.namePlaceholder')}
          required
          error={getFieldError(errors.name, t)}
          {...register('name')}
        />

        <Input
          label={t('form.floorNumber')}
          type="number"
          min={1}
          required
          error={getFieldError(errors.floorNumber, t)}
          {...register('floorNumber', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('form.area')}
          placeholder="25.0"
          required
          error={getFieldError(errors.area, t)}
          {...register('area')}
        />

        <Input
          label={t('form.rentPrice')}
          type="number"
          min={0}
          step={50000}
          required
          error={getFieldError(errors.rentPrice, t)}
          {...register('rentPrice', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-rentify-text-primary">
              {t('form.depositAmount')} *
            </label>
            <button
              type="button"
              onClick={handleDepositMatchPrice}
              className="text-[11px] text-rentify-primary hover:underline cursor-pointer"
            >
              {t('form.matchRentPrice')}
            </button>
          </div>
          <Input
            type="number"
            min={0}
            step={50000}
            required
            error={getFieldError(errors.depositAmount, t)}
            {...register('depositAmount', { valueAsNumber: true })}
          />
        </div>

        <Input
          label={t('form.maxOccupancy')}
          type="number"
          min={1}
          placeholder={t('form.unlimitedOccupancy')}
          error={getFieldError(errors.maxOccupancy, t)}
          {...register('maxOccupancy', {
            setValueAs: (v) => (v === '' || isNaN(v) ? null : Number(v)),
          })}
        />
      </div>

      <div>
        <SelectDropdown
          label={t('form.genderPolicy')}
          options={GENDER_POLICY_OPTIONS.map((opt) => ({
            value: opt.value,
            label: t(opt.labelKey),
          }))}
          value={watch('genderPolicy')}
          onChange={(e) =>
            setValue('genderPolicy', e.target.value as GenderPolicy, { shouldValidate: true })
          }
        />
      </div>

      <RoomAmenitiesSelector
        values={watch('amenities')}
        onChange={(key, checked) => {
          const current = watch('amenities') || {};
          setValue('amenities', { ...current, [key]: checked }, { shouldDirty: true });
        }}
      />
    </div>
  );
};

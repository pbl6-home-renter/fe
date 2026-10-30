import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getFieldError } from '@/lib/form';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import type { BuildingInfoFormData } from '../forms/building.schema';

interface BuildingInfoFormProps {
  form: UseFormReturn<BuildingInfoFormData>;
  isApproved?: boolean;
  disabled?: boolean;
}

export const BuildingInfoForm = ({
  form,
  isApproved = false,
  disabled = false,
}: BuildingInfoFormProps) => {
  const { t } = useTranslation('buildings');
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isLocationLocked = isApproved;
  const currentProvince = watch('province');
  const currentWard = watch('ward');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rentify-text-secondary">
          {t('form.sectionGeneral')}
        </h3>

        <Input
          label={t('form.name')}
          placeholder={t('form.namePlaceholder')}
          error={getFieldError(errors.name, t)}
          disabled={disabled}
          {...register('name')}
        />

        <ProvinceWardSelect
          province={currentProvince}
          ward={currentWard}
          onChange={({ province, ward }) => {
            setValue('province', province, { shouldValidate: true });
            setValue('ward', ward, { shouldValidate: true });
          }}
          provinceError={getFieldError(errors.province, t)}
          wardError={getFieldError(errors.ward, t)}
          disabled={disabled}
          isLocked={isLocationLocked}
        />

        <Input
          label={t('form.address')}
          placeholder={t('form.addressPlaceholder')}
          error={getFieldError(errors.address, t)}
          disabled={disabled}
          {...register('address')}
        />

        <Input
          type="number"
          label={t('form.totalFloors')}
          placeholder={t('form.totalFloorsPlaceholder')}
          error={getFieldError(errors.totalFloors, t)}
          disabled={disabled}
          {...register('totalFloors', {
            valueAsNumber: true,
          })}
        />

        <Textarea
          label={t('form.description')}
          placeholder={t('form.descriptionPlaceholder')}
          rows={3}
          error={getFieldError(errors.description, t)}
          disabled={disabled}
          {...register('description')}
        />
      </div>

      <div className="space-y-3 pt-2 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rentify-text-secondary">
          {t('form.sectionAmenities')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Checkbox
            label={t('amenities.elevator')}
            disabled={disabled}
            {...register('amenities.elevator')}
          />
          <Checkbox
            label={t('amenities.parking')}
            disabled={disabled}
            {...register('amenities.parking')}
          />
          <Checkbox
            label={t('amenities.securityCamera')}
            disabled={disabled}
            {...register('amenities.securityCamera')}
          />
          <Checkbox
            label={t('amenities.fingerprintLock')}
            disabled={disabled}
            {...register('amenities.fingerprintLock')}
          />
        </div>
      </div>
    </div>
  );
};

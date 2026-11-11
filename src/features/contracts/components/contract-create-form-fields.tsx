import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { useContractCreateRoomOptions } from '../hooks/use-contract-create-room-options';
import { getFieldError } from '@/lib/form';
import type { ContractCreateFormData } from '../forms/contract.schema';

interface ContractCreateFormFieldsProps {
  form: UseFormReturn<ContractCreateFormData>;
}

export const ContractCreateFormFields = ({ form }: ContractCreateFormFieldsProps) => {
  const { t } = useTranslation('contracts');
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const { selectedBuildingId, selectedRoomId, buildingOptions, roomOptions, isLoadingRooms } =
    useContractCreateRoomOptions(form);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-rentify-text-primary">
            {t('form.building')} <span className="text-rentify-error">*</span>
          </label>
          <SelectDropdown
            options={buildingOptions}
            placeholder={t('form.selectBuilding')}
            value={selectedBuildingId}
            onChange={(e) => {
              setValue('buildingId', e.target.value, { shouldValidate: true });
              setValue('roomId', '', { shouldValidate: true });
            }}
            error={getFieldError(errors.buildingId, t)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-rentify-text-primary">
            {t('form.room')} <span className="text-rentify-error">*</span>
          </label>
          <SelectDropdown
            options={roomOptions}
            placeholder={
              !selectedBuildingId
                ? t('form.selectBuilding')
                : roomOptions.length === 0 && !isLoadingRooms
                  ? t('form.noAvailableRooms')
                  : t('form.selectRoom')
            }
            value={selectedRoomId}
            disabled={!selectedBuildingId || isLoadingRooms}
            onChange={(e) => setValue('roomId', e.target.value, { shouldValidate: true })}
            error={getFieldError(errors.roomId, t)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('form.tenantName')}
          placeholder={t('form.tenantNamePlaceholder')}
          required
          error={getFieldError(errors.tenantName, t)}
          {...register('tenantName')}
        />

        <Input
          label={t('form.tenantPhone')}
          placeholder={t('form.tenantPhonePlaceholder')}
          required
          error={getFieldError(errors.tenantPhone, t)}
          {...register('tenantPhone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('form.rentPrice')}
          type="number"
          min={0}
          step={50000}
          required
          error={getFieldError(errors.rentPrice, t)}
          {...register('rentPrice', { valueAsNumber: true })}
        />

        <Input
          label={t('form.depositAmount')}
          type="number"
          min={0}
          step={50000}
          required
          error={getFieldError(errors.depositAmount, t)}
          {...register('depositAmount', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('form.startDate')}
          type="date"
          required
          error={getFieldError(errors.startDate, t)}
          {...register('startDate')}
        />

        <Input
          label={t('form.endDate')}
          type="date"
          required
          error={getFieldError(errors.endDate, t)}
          {...register('endDate')}
        />
      </div>

      <div className="space-y-1">
        <Input
          label={t('form.vehicleCount')}
          type="number"
          min={0}
          placeholder={t('form.vehicleCountPlaceholder')}
          error={getFieldError(errors.vehicleCount, t)}
          {...register('vehicleCount', {
            setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
          })}
        />
        <p className="text-[11px] text-rentify-text-secondary">{t('form.vehicleCountHint')}</p>
      </div>
    </div>
  );
};

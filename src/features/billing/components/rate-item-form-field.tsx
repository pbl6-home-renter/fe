import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import type { RatePolicyFormData } from '../forms/rate-policy.schema';
import { BILLING_UNITS, RATE_KINDS, RATE_TYPES } from '../constants/billing.constants';

interface RateItemFormFieldProps {
  index: number;
  form: UseFormReturn<RatePolicyFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export const RateItemFormField = ({ index, form, onRemove, canRemove }: RateItemFormFieldProps) => {
  const { t } = useTranslation('billing');
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentType = watch(`rates.${index}.type`);
  const currentKind = watch(`rates.${index}.rateKind`);
  const currentUnit = watch(`rates.${index}.billingUnit`);
  const unitPrice = watch(`rates.${index}.unitPrice`);

  const typeOptions = RATE_TYPES.map((type) => ({
    value: type,
    label: t(`rateTypes.${type}`),
  }));

  const kindOptions = RATE_KINDS.map((kind) => ({
    value: kind,
    label: t(`rateKinds.${kind}`),
  }));

  const unitOptions = BILLING_UNITS.map((unit) => ({
    value: unit,
    label: t(`billingUnits.${unit}`),
  }));

  const isTiered = currentKind === 'tiered';
  const itemError = errors.rates?.[index];

  return (
    <div className="p-4 rounded-xl border border-rentify-divider bg-canvas-base flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-rentify-divider/50">
        <span className="text-xs font-bold text-rentify-text-primary">
          {t('dialog.serviceIndex', { index: index + 1 })}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-rentify-error hover:bg-rentify-error/10 h-7 px-2 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {t('dialog.removeService')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SelectDropdown
          label={t('dialog.typeLabel')}
          options={typeOptions}
          value={currentType}
          onSelectOption={(opt) => {
            setValue(`rates.${index}.type`, opt.value as RatePolicyFormData['rates'][number]['type']);
          }}
        />

        <Input
          label={t('dialog.nameLabel')}
          placeholder={t('dialog.namePlaceholder')}
          {...register(`rates.${index}.name`)}
          error={itemError?.name?.message ? t('dialog.nameRequired') : undefined}
        />

        <SelectDropdown
          label={t('dialog.kindLabel')}
          options={kindOptions}
          value={currentKind}
          onSelectOption={(opt) => {
            setValue(`rates.${index}.rateKind`, opt.value as RatePolicyFormData['rates'][number]['rateKind']);
          }}
        />

        <SelectDropdown
          label={t('dialog.unitLabel')}
          options={unitOptions}
          value={currentUnit}
          onSelectOption={(opt) => {
            setValue(`rates.${index}.billingUnit`, opt.value as RatePolicyFormData['rates'][number]['billingUnit']);
          }}
        />
      </div>

      {!isTiered ? (
        <div className="max-w-xs">
          <Input
            label={t('dialog.priceLabel')}
            placeholder="3800"
            type="number"
            min={0}
            value={unitPrice ?? ''}
            onChange={(e) => setValue(`rates.${index}.unitPrice`, e.target.value)}
            error={itemError?.unitPrice?.message ? t('dialog.priceInvalid') : undefined}
          />
        </div>
      ) : (
        <div className="p-3 bg-rentify-surface rounded-lg border border-rentify-divider/60 text-xs text-rentify-text-secondary">
          {t('dialog.tieredNotice')}
        </div>
      )}
    </div>
  );
};

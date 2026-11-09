import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { RatePolicyDto, RatePolicyScope } from '../types/billing.dto';
import { useRatePolicyForm } from '../hooks/use-rate-policy-form';
import { RateItemFormField } from './rate-item-form-field';

export interface RatePolicyDialogProps {
  open: boolean;
  onClose: () => void;
  scope: RatePolicyScope;
  buildingId?: string;
  roomId?: string;
  existingPolicy?: RatePolicyDto | null;
  onSuccess?: () => void;
}

export const RatePolicyDialog = ({
  open,
  onClose,
  scope,
  buildingId,
  roomId,
  existingPolicy,
  onSuccess,
}: RatePolicyDialogProps) => {
  const { t } = useTranslation('billing');

  const { form, fields, append, remove, onSubmit, isSubmitting } = useRatePolicyForm({
    scope,
    buildingId,
    roomId,
    existingPolicy,
    isOpen: open,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onCancel: onClose,
  });

  const handleAddService = () => {
    append({
      type: 'other',
      name: '',
      rateKind: 'flat',
      unitPrice: '50000',
      steps: null,
      billingUnit: 'room',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="2xl"
      title={existingPolicy?.id ? t('dialog.editPolicyTitle') : t('dialog.createPolicyTitle')}
      description={scope === 'building' ? t('dialog.buildingPolicyDesc') : t('dialog.roomPolicyDesc')}
      footer={
        <>
          <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="button" variant="primary" size="sm" isLoading={isSubmitting} onClick={onSubmit}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <RateItemFormField
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddService}
            className="w-full border-dashed gap-1.5 text-xs text-rentify-primary"
          >
            <Plus className="w-4 h-4" />
            <span>{t('dialog.addServiceButton')}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

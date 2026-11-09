import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import type { BillingSettingDto, BillingSettingScope } from '../types/billing.dto';
import { useBillingSettingForm } from '../hooks/use-billing-setting-form';

export interface BillingSettingDialogProps {
  open: boolean;
  onClose: () => void;
  scope: BillingSettingScope;
  buildingId: string;
  roomId?: string;
  existingSetting?: BillingSettingDto | null;
  onSuccess?: () => void;
}

export const BillingSettingDialog = ({
  open,
  onClose,
  scope,
  buildingId,
  roomId,
  existingSetting,
  onSuccess,
}: BillingSettingDialogProps) => {
  const { t } = useTranslation('billing');

  const { form, onSubmit, isSubmitting } = useBillingSettingForm({
    scope,
    buildingId,
    roomId,
    existingSetting,
    isOpen: open,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onCancel: onClose,
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const paymentDueDay = watch('paymentDueDay');
  const remindDay = watch('remindDay');
  const botEnabled = watch('botEnabled');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={existingSetting?.id ? t('setting.dialogEditTitle') : t('setting.dialogCreateTitle')}
      description={scope === 'building' ? t('setting.dialogBuildingDesc') : t('setting.dialogRoomDesc')}
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
      <form onSubmit={onSubmit} className="space-y-4 py-2">
        <Input
          label={t('setting.dueDayFieldLabel')}
          helperText={t('setting.dueDayFieldHelper')}
          type="number"
          min={1}
          max={28}
          value={paymentDueDay ?? ''}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : 1;
            setValue('paymentDueDay', val, { shouldValidate: true });
          }}
          error={errors.paymentDueDay?.message ? t('setting.dayRangeError') : undefined}
          required
        />

        <Input
          label={t('setting.remindDayFieldLabel')}
          helperText={t('setting.remindDayFieldHelper')}
          type="number"
          min={1}
          max={28}
          value={remindDay ?? ''}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : null;
            setValue('remindDay', val, { shouldValidate: true });
          }}
          error={errors.remindDay?.message ? t('setting.dayRangeError') : undefined}
        />

        <div className="pt-2">
          <Checkbox
            label={t('setting.botFieldLabel')}
            helperText={t('setting.botFieldHelper')}
            checked={botEnabled}
            onChange={(e) => setValue('botEnabled', e.target.checked)}
          />
        </div>
      </form>
    </Dialog>
  );
};

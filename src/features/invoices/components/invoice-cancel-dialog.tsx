import { useTranslation } from 'react-i18next';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { getFieldError } from '@/lib/form';
import { useInvoiceCancelForm } from '../hooks/use-invoice-cancel-form';

export interface InvoiceCancelDialogProps {
  open: boolean;
  invoiceId: string;
  invoiceCode: string;
  onClose: () => void;
}

export const InvoiceCancelDialog = ({ open, invoiceId, invoiceCode, onClose }: InvoiceCancelDialogProps) => {
  const { t } = useTranslation('invoices');
  const { form, isSubmitting, onSubmit } = useInvoiceCancelForm({
    invoiceId,
    isOpen: open,
    onSuccess: onClose,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('cancelDialog.title', { code: invoiceCode })}
      description={t('cancelDialog.description')}
      maxWidth="md"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="button" variant="danger" onClick={onSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
            {t('cancelDialog.confirmButton')}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4 py-2">
        <AlertBanner variant="warning" title={t('cancelDialog.warningTitle')}>
          <span className="text-sm">{t('cancelDialog.warningDescription')}</span>
        </AlertBanner>

        <FormField
          label={t('cancelDialog.reasonLabel')}
          required
          htmlFor="invoice-cancel-reason"
          helperText={t('cancelDialog.reasonHelper')}
          error={getFieldError(errors.reason, t)}
        >
          <Textarea
            id="invoice-cancel-reason"
            rows={3}
            placeholder={t('cancelDialog.reasonPlaceholder')}
            disabled={isSubmitting}
            {...register('reason')}
          />
        </FormField>
      </form>
    </Dialog>
  );
};

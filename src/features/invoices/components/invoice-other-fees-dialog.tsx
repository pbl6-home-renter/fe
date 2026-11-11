import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getFieldError } from '@/lib/form';
import { INVOICE_MAX_OTHER_FEES } from '../constants/invoices.constants';
import { useInvoiceOtherFeesForm } from '../hooks/use-invoice-other-fees-form';
import type { InvoiceOtherFeeDto } from '../types/invoices.dto';

export interface InvoiceOtherFeesDialogProps {
  open: boolean;
  invoiceId: string;
  initialFees: InvoiceOtherFeeDto[];
  initialNote: string | null;
  onClose: () => void;
}

const OtherFeesDialogBody = ({
  invoiceId,
  initialFees,
  initialNote,
  onClose,
}: Omit<InvoiceOtherFeesDialogProps, 'open'>) => {
  const { t } = useTranslation('invoices');
  const { form, fields, hasTotalNegativeError, isSubmitting, handleAddFee, handleRemoveFee, onSubmit } =
    useInvoiceOtherFeesForm({
      invoiceId,
      initialFees,
      initialNote,
      isOpen: true,
      onSuccess: onClose,
    });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4 py-2">
      {hasTotalNegativeError && (
        <AlertBanner variant="error" title={t('otherFeesDialog.totalNegativeTitle')}>
          <span className="text-sm">{t('otherFeesDialog.totalNegativeDesc')}</span>
        </AlertBanner>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-rentify-text-primary">{t('otherFeesDialog.itemsLabel')}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFee}
            disabled={isSubmitting || fields.length >= INVOICE_MAX_OTHER_FEES}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('otherFeesDialog.addFee')}</span>
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="rounded-xl border border-dashed border-rentify-divider p-4 text-center text-xs text-rentify-text-secondary">
            {t('otherFeesDialog.emptyFees')}
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider bg-surface-container-low p-3 sm:grid-cols-12"
              >
                <div className="sm:col-span-6">
                  <FormField
                    label={t('otherFeesDialog.feeName')}
                    required
                    htmlFor={`other-fee-name-${index}`}
                    error={getFieldError(errors.otherFees?.[index]?.name, t)}
                  >
                    <Input
                      id={`other-fee-name-${index}`}
                      placeholder={t('otherFeesDialog.feeNamePlaceholder')}
                      disabled={isSubmitting}
                      {...register(`otherFees.${index}.name`)}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-5">
                  <FormField
                    label={t('otherFeesDialog.feeAmount')}
                    required
                    htmlFor={`other-fee-amount-${index}`}
                    helperText={t('otherFeesDialog.feeAmountHelper')}
                    error={getFieldError(errors.otherFees?.[index]?.amount, t)}
                  >
                    <Input
                      id={`other-fee-amount-${index}`}
                      className="tabular-nums"
                      placeholder={t('otherFeesDialog.feeAmountPlaceholder')}
                      disabled={isSubmitting}
                      {...register(`otherFees.${index}.amount`)}
                    />
                  </FormField>
                </div>

                <div className="flex items-start justify-end sm:col-span-1 sm:pt-7">
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFee(index)}
                    disabled={isSubmitting}
                    aria-label={t('otherFeesDialog.removeFee')}
                    className="text-rentify-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormField label={t('detail.noteLabel')} htmlFor="invoice-note" error={getFieldError(errors.note, t)}>
        <Textarea
          id="invoice-note"
          rows={3}
          placeholder={t('otherFeesDialog.notePlaceholder')}
          disabled={isSubmitting}
          {...register('note')}
        />
      </FormField>

      <div className="flex w-full items-center justify-end gap-3 border-t border-rentify-divider pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          {t('actions.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
          {t('actions.saveChanges')}
        </Button>
      </div>
    </form>
  );
};

export const InvoiceOtherFeesDialog = ({
  open,
  invoiceId,
  initialFees,
  initialNote,
  onClose,
}: InvoiceOtherFeesDialogProps) => {
  const { t } = useTranslation('invoices');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('otherFeesDialog.title')}
      description={t('otherFeesDialog.description')}
      maxWidth="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      {open && (
        <OtherFeesDialogBody
          invoiceId={invoiceId}
          initialFees={initialFees}
          initialNote={initialNote}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

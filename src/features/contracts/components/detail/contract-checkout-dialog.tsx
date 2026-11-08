import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { getFieldError } from '@/lib/form';
import { ROUTES } from '@/config/routes.config';
import type { UseFormReturn } from 'react-hook-form';
import type { CheckoutFormValues } from '../../forms/contract-member.schema';

interface ContractCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<CheckoutFormValues>;
  isSubmitting: boolean;
  settlementPeriod: string | null;
  startDate: string;
  buildingId?: string | null;
}

export const ContractCheckoutDialog = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
  settlementPeriod,
  startDate,
  buildingId,
}: ContractCheckoutDialogProps) => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
  } = form;

  const today = new Date().toISOString().slice(0, 10);

  const handleOpenInvoices = () => {
    onClose();
    const query = buildingId && settlementPeriod ? `?buildingId=${buildingId}&period=${settlementPeriod}` : '';
    navigate(`${ROUTES.LANDLORD.INVOICES}${query}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('checkout.title')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onSubmit} isLoading={isSubmitting}>
            {t('checkout.submitBtn')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1 text-left">
        <AlertBanner variant="info" title={t('checkout.guidanceTitle')}>
          {t('checkout.guidanceDesc')}
        </AlertBanner>

        {settlementPeriod && (
          <AlertBanner variant="warning" title={t('checkout.settlementNotReadyTitle')}>
            <div className="space-y-2 mt-1">
              <p className="text-xs text-rentify-text-secondary">
                {t('checkout.settlementNotReadyDesc', { period: settlementPeriod })}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenInvoices}
                className="gap-1.5 text-xs text-rentify-warning border-rentify-warning/40 hover:bg-rentify-warning/5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('checkout.openInvoiceBtn', { period: settlementPeriod })}</span>
              </Button>
            </div>
          </AlertBanner>
        )}

        <Input
          id="completedOn"
          type="date"
          label={t('checkout.completedOnLabel')}
          min={startDate}
          max={today}
          error={getFieldError(errors.completedOn, t)}
          {...register('completedOn')}
        />
      </div>
    </Dialog>
  );
};

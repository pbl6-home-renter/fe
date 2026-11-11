import { useTranslation } from 'react-i18next';
import { Edit3 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContractEditForm } from '../hooks/use-contract-edit-form';
import { ContractStatus } from '../enums/contract-status.enum';
import { getFieldError } from '@/lib/form';
import type { ContractDetailDto } from '../types/contract.dto';

interface ContractEditModalProps {
  open: boolean;
  onClose: () => void;
  contract: ContractDetailDto;
  onSuccess?: (contract: ContractDetailDto) => void;
}

export const ContractEditModal = ({ open, onClose, contract, onSuccess }: ContractEditModalProps) => {
  const { t } = useTranslation('contracts');
  const isDraft = contract.status === ContractStatus.DRAFT;

  const { form, onSubmit, isSubmitting } = useContractEditForm({
    contract,
    onSuccess: (updated) => {
      onClose();
      onSuccess?.(updated);
    },
    onCancel: onClose,
  });

  const {
    register,
    formState: { errors },
  } = form;

  const title = isDraft ? t('form.editTitle') : t('form.editVehicleTitle');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <Edit3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-rentify-text-primary">{title}</h3>
            <p className="text-xs font-normal text-rentify-text-secondary">
              {contract.roomName ? `${contract.roomName} • ` : ''}
              {contract.tenantName || ''}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('form.cancel')}
          </Button>
          <Button
            type="submit"
            form="contract-edit-form"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {t('form.submitEdit')}
          </Button>
        </div>
      }
    >
      <form id="contract-edit-form" onSubmit={onSubmit} className="space-y-4 py-1">
        {errors.root?.serverError && (
          <div className="rounded-xl border border-rentify-error/20 bg-rentify-error/10 p-3 text-sm text-rentify-error">
            {errors.root.serverError.message}
          </div>
        )}

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

        <Textarea
          label={t('form.description')}
          placeholder={t('form.descriptionPlaceholder')}
          rows={4}
          error={getFieldError(errors.description, t)}
          {...register('description')}
        />
      </form>
    </Dialog>
  );
};

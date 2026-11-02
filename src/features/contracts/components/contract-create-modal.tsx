import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { ContractCreateFormFields } from './contract-create-form-fields';
import { useContractCreateForm } from '../hooks/use-contract-create-form';
import type { ContractDetailDto } from '../types/contract.dto';

interface ContractCreateModalProps {
  open: boolean;
  onClose: () => void;
  defaultBuildingId?: string;
  defaultRoomId?: string;
  onSuccess?: (contract: ContractDetailDto) => void;
}

export const ContractCreateModal = ({
  open,
  onClose,
  defaultBuildingId,
  defaultRoomId,
  onSuccess,
}: ContractCreateModalProps) => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();

  const { form, onSubmit, isSubmitting } = useContractCreateForm({
    defaultBuildingId,
    defaultRoomId,
    onSuccess: (contract) => {
      onClose();
      onSuccess?.(contract);
      navigate(ROUTES.LANDLORD.CONTRACT_DETAIL(contract.id));
    },
    onCancel: onClose,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-rentify-text-primary">
              {t('form.createTitle')}
            </h3>
            <p className="text-xs font-normal text-rentify-text-secondary">
              {t('form.createSubtitle')}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('form.cancel')}
          </Button>
          <Button
            type="submit"
            form="contract-create-form"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {t('form.submitCreate')}
          </Button>
        </div>
      }
    >
      <form id="contract-create-form" onSubmit={onSubmit} className="py-1">
        <ContractCreateFormFields form={form} />
      </form>
    </Dialog>
  );
};

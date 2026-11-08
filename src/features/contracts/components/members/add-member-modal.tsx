import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFieldError } from '@/lib/form';
import { useAddMemberForm } from '../../hooks/use-add-member-form';
import type { ContractDetailDto } from '../../types/contract.dto';

interface AddMemberModalProps {
  contract: ContractDetailDto;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMemberModal = ({ contract, open, onClose, onSuccess }: AddMemberModalProps) => {
  const { t } = useTranslation('contracts');
  const { form, handleSubmit, isSubmitting } = useAddMemberForm({
    contract,
    open,
    onSuccess,
    onClose,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('members.addTitle')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            {t('members.submitAdd')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1 text-left">
        <Input
          id="tenantName"
          label={t('members.nameLabel')}
          placeholder={t('members.namePlaceholder')}
          error={getFieldError(errors.tenantName, t)}
          {...register('tenantName')}
        />

        <Input
          id="tenantPhone"
          label={t('members.phoneLabel')}
          placeholder={t('members.phonePlaceholder')}
          error={getFieldError(errors.tenantPhone, t)}
          {...register('tenantPhone')}
        />

        <Input
          id="joinedAt"
          type="date"
          label={t('members.joinedAtLabel')}
          min={contract.startDate}
          max={contract.endDate}
          error={getFieldError(errors.joinedAt, t)}
          {...register('joinedAt')}
        />
      </form>
    </Dialog>
  );
};

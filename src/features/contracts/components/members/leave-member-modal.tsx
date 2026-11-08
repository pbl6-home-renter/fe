import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFieldError } from '@/lib/form';
import { formatDate } from '@/lib/utils/format';
import type { ContractMemberListItemDto } from '../../types/contract-member.dto';
import type { UseFormReturn } from 'react-hook-form';
import type { LeaveMemberFormValues } from '../../forms/contract-member.schema';

interface LeaveMemberModalProps {
  member: ContractMemberListItemDto | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<LeaveMemberFormValues>;
  isSubmitting: boolean;
  maxDate: string;
}

export const LeaveMemberModal = ({
  member,
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
  maxDate,
}: LeaveMemberModalProps) => {
  const { t } = useTranslation('contracts');
  const {
    register,
    formState: { errors },
  } = form;

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('members.leaveTitle')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onSubmit} isLoading={isSubmitting}>
            {t('members.submitLeave')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1 text-left">
        <div className="rounded-xl border border-rentify-divider bg-rentify-background p-3 text-xs space-y-1">
          <p className="font-semibold text-rentify-text-primary">{member.tenantName}</p>
          <p className="text-rentify-text-secondary">{member.tenantPhone || '—'}</p>
          <p className="text-rentify-text-secondary">
            {t('members.joinedDate')}:{' '}
            <strong className="text-rentify-text-primary">{formatDate(member.joinedAt)}</strong>
          </p>
        </div>

        <Input
          id="leftOn"
          type="date"
          label={t('members.leftDateLabel')}
          min={member.joinedAt}
          max={maxDate}
          error={getFieldError(errors.leftOn, t)}
          {...register('leftOn')}
        />
      </div>
    </Dialog>
  );
};

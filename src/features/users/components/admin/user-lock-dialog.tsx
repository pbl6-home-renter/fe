import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { getFieldError } from '@/lib/form';
import { useUserLockForm } from '../../hooks/use-user-lock-form';

export interface UserLockDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onSuccess?: () => void;
}

export const UserLockDialog = ({ open, onClose, user, onSuccess }: UserLockDialogProps) => {
  const { t } = useTranslation('users');

  const { form, onSubmit, isSubmitting } = useUserLockForm({
    userId: user?.id ?? '',
    isOpen: open,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onCancel: onClose,
  });

  const {
    register,
    formState: { errors },
  } = form;

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('dialogs.lock.title')}
      description={t('dialogs.lock.description', { name: user.name, email: user.email })}
      maxWidth="md"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button variant="danger" onClick={onSubmit} isLoading={isSubmitting}>
            {t('dialogs.lock.confirmButton')}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4 py-2">
        <AlertBanner variant="warning" title={t('dialogs.lock.warningTitle')}>
          {t('dialogs.lock.warningDescription')}
        </AlertBanner>

        <FormField
          label={t('fields.lockReason')}
          required
          htmlFor="user-lock-reason"
          error={getFieldError(errors.lockReason, t)}
          helperText={t('fields.lockReasonHelper')}
        >
          <Textarea
            id="user-lock-reason"
            placeholder={t('fields.lockReasonPlaceholder')}
            rows={3}
            maxLength={500}
            showCount
            {...register('lockReason')}
          />
        </FormField>
      </form>
    </Dialog>
  );
};

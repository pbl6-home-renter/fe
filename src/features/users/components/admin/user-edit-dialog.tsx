import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { getFieldError } from '@/lib/form';
import { useUserEditForm } from '../../hooks/use-user-edit-form';

export interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  } | null;
  onSuccess?: () => void;
}

export const UserEditDialog = ({ open, onClose, user, onSuccess }: UserEditDialogProps) => {
  const { t } = useTranslation('users');

  const { form, onSubmit, isSubmitting } = useUserEditForm({
    userId: user?.id ?? '',
    initialValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
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
      title={t('dialogs.edit.title')}
      description={t('dialogs.edit.description', { email: user.email })}
      maxWidth="md"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} isLoading={isSubmitting}>
            {t('actions.save')}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4 py-2">
        <FormField label={t('fields.name')} required htmlFor="user-edit-name" error={getFieldError(errors.name, t)}>
          <Input id="user-edit-name" placeholder={t('fields.namePlaceholder')} {...register('name')} />
        </FormField>

        <FormField label={t('fields.phone')} required htmlFor="user-edit-phone" error={getFieldError(errors.phone, t)}>
          <Input id="user-edit-phone" placeholder={t('fields.phonePlaceholder')} {...register('phone')} />
        </FormField>
      </form>
    </Dialog>
  );
};

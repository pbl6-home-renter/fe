import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { useDeleteUserMutation } from '../../hooks/use-delete-user-mutation';

export interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onSuccess?: () => void;
}

export const UserDeleteDialog = ({ open, onClose, user, onSuccess }: UserDeleteDialogProps) => {
  const { t } = useTranslation('users');
  const deleteMutation = useDeleteUserMutation();

  if (!user) return null;

  const handleDelete = () => {
    deleteMutation.mutate(user.id, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('dialogs.delete.title')}
      description={t('dialogs.delete.description', { name: user.name, email: user.email })}
      maxWidth="md"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            {t('actions.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
            {t('dialogs.delete.confirmButton')}
          </Button>
        </div>
      }
    >
      <div className="space-y-3 py-2">
        <AlertBanner variant="error" title={t('dialogs.delete.warningTitle')}>
          {t('dialogs.delete.warningDescription')}
        </AlertBanner>
        <p className="text-sm text-rentify-text-secondary">{t('dialogs.delete.message')}</p>
      </div>
    </Dialog>
  );
};

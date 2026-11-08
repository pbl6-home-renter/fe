import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useUnlockUserMutation } from '../../hooks/use-unlock-user-mutation';

export interface UserUnlockDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onSuccess?: () => void;
}

export const UserUnlockDialog = ({ open, onClose, user, onSuccess }: UserUnlockDialogProps) => {
  const { t } = useTranslation('users');
  const unlockMutation = useUnlockUserMutation();

  if (!user) return null;

  const handleUnlock = () => {
    unlockMutation.mutate(user.id, {
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
      title={t('dialogs.unlock.title')}
      description={t('dialogs.unlock.description', { name: user.name, email: user.email })}
      maxWidth="md"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={unlockMutation.isPending}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleUnlock} isLoading={unlockMutation.isPending}>
            {t('dialogs.unlock.confirmButton')}
          </Button>
        </div>
      }
    >
      <p className="py-2 text-sm text-rentify-text-secondary">{t('dialogs.unlock.message')}</p>
    </Dialog>
  );
};

import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutModal = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      closeOnOutsideClick={!isLoading}
      closeOnEsc={!isLoading}
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="px-4"
          >
            {t('logoutModal.cancel')}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="gap-2 px-4"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logoutModal.confirm')}</span>
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 pt-1">
        <div className="w-10 h-10 rounded-xl bg-rentify-error/10 text-rentify-error flex items-center justify-center shrink-0">
          <LogOut className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-rentify-text-primary">
            {t('logoutModal.title')}
          </h2>
          <p className="text-xs text-rentify-text-secondary leading-relaxed">
            {t('logoutModal.description')}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

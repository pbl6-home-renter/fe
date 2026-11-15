import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, ShieldAlert, UserPlus } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';

export interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const LoginPromptModal = ({ open, onClose, title, description }: LoginPromptModalProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    onClose();
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    navigate(`${ROUTES.LOGIN}?redirect=${returnUrl}`);
  };

  const handleRegister = () => {
    onClose();
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    navigate(`${ROUTES.REGISTER}?redirect=${returnUrl}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rentify-primary" />
          <span className="font-bold text-rentify-text-primary">{title || t('search.authRequiredTitle')}</span>
        </div>
      }
      description={description || t('search.authRequiredDescription')}
      maxWidth="sm"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full sm:w-auto text-xs">
            {t('search.cancel')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegister} className="w-full sm:w-auto text-xs">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            <span>{t('search.register')}</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleLogin} className="w-full sm:w-auto text-xs">
            <LogIn className="h-3.5 w-3.5 mr-1.5" />
            <span>{t('search.login')}</span>
          </Button>
        </div>
      }
    >
      <div className="py-2 text-xs text-rentify-text-secondary leading-relaxed">{t('search.authRequiredHint')}</div>
    </Dialog>
  );
};

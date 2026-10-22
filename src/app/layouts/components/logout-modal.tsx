import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, X, Building2, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { getPortalMetaByRole } from '@/config/navigation.config';

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
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const portalMeta = getPortalMetaByRole(role);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, isLoading]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142A4C]/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-desc"
        className="relative w-full max-w-110 bg-white rounded-[24px] shadow-[0_16px_40px_-8px_rgba(20,42,76,0.18),0_0_0_1px_#D7E3F2] p-6 sm:p-8 flex flex-col transition-all transform animate-in zoom-in-95 duration-150"
      >
        {/* Top close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label={t('cancel')}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Anchor */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-rentify-error shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-rentify-error">
              {t('logoutModal.badge', 'Phiên làm việc hiện tại')}
            </span>
            <h2
              id="logout-dialog-title"
              className="text-xl font-bold text-rentify-text-primary tracking-tight"
            >
              {t('logoutModal.title', 'Đăng xuất tài khoản')}
            </h2>
          </div>
        </div>

        {/* Description Prompt */}
        <p
          id="logout-dialog-desc"
          className="text-sm text-rentify-text-secondary leading-relaxed mb-5"
        >
          {t(
            'logoutModal.description',
            'Bạn có chắc chắn muốn đăng xuất khỏi cổng Rentify trên thiết bị này không?'
          )}
        </p>

        {/* Current User Session Micro-Card */}
        <div className="bg-rentify-background rounded-xl p-3.5 mb-6 flex items-center justify-between border border-rentify-divider">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={user?.name} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-rentify-text-primary truncate">
                {user?.name || t('user')}
              </span>
              <span className="text-xs text-rentify-text-secondary truncate flex items-center gap-1">
                {role === 'landlord' ? (
                  <>
                    <Building2 className="w-3 h-3 text-rentify-primary inline shrink-0" />
                    <span>{t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-rentify-primary inline shrink-0" />
                    <span>{t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}</span>
                  </>
                )}
              </span>
            </div>
          </div>
          <span className="text-xs text-rentify-success flex items-center gap-1.5 font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-rentify-success inline-block animate-pulse" />
            {t('logoutModal.onlineStatus', 'Trực tuyến')}
          </span>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isLoading}
            className="w-full justify-center"
          >
            {t('logoutModal.cancel', 'Hủy')}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="lg"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logoutModal.confirm', 'Đăng xuất')}</span>
          </Button>
        </div>

        {/* Re-auth Advisory */}
        <p className="mt-4 text-center text-xs text-rentify-text-secondary">
          {t('logoutModal.advisory', 'Bạn sẽ cần xác thực thông tin khi đăng nhập lại.')}
        </p>
      </div>
    </div>
  );
};

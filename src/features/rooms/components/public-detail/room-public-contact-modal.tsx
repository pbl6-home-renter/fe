import { useTranslation } from 'react-i18next';
import { Copy, Phone, MessageSquare } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { notify } from '@/lib/notifications/notify';

export interface RoomPublicContactModalProps {
  open: boolean;
  onClose: () => void;
  landlordName?: string;
  landlordPhone?: string;
  onChat?: () => void;
}

export const RoomPublicContactModal = ({
  open,
  onClose,
  landlordName,
  landlordPhone,
  onChat,
}: RoomPublicContactModalProps) => {
  const { t } = useTranslation('rooms');

  const handleCopy = () => {
    if (landlordPhone && navigator.clipboard) {
      void navigator.clipboard.writeText(landlordPhone);
      notify.success(t('detail.contactModal.copiedToast'));
    }
  };

  const handleCall = () => {
    if (landlordPhone) {
      window.location.href = `tel:${landlordPhone}`;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-rentify-primary" />
          <span className="font-bold text-rentify-text-primary">{t('detail.contactModal.title')}</span>
        </div>
      }
      description={t('detail.contactModal.desc')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            {t('detail.contactModal.closeAction')}
          </Button>
          {onChat && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChat}
              className="text-xs gap-1.5 text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{t('detail.contactModal.chatAction')}</span>
            </Button>
          )}
          {landlordPhone && (
            <Button variant="primary" size="sm" onClick={handleCall} className="text-xs gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>{t('detail.contactModal.callAction')}</span>
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={landlordName || 'Rentify'} size="md" />
              <div>
                <div className="text-xs text-rentify-text-secondary">{t('detail.contactModal.landlordLabel')}</div>
                <div className="text-sm font-bold text-rentify-text-primary">
                  {landlordName || t('search.verifiedLandlord')}
                </div>
              </div>
            </div>
            {onChat && (
              <Button
                variant="outline"
                size="sm"
                onClick={onChat}
                className="h-8 gap-1.5 text-xs text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{t('detail.contactModal.chatAction')}</span>
              </Button>
            )}
          </div>
          {landlordPhone && (
            <div className="flex items-center justify-between pt-2 border-t border-rentify-divider text-sm">
              <span className="font-mono font-bold text-rentify-primary text-base">{landlordPhone}</span>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1 text-xs">
                <Copy className="h-3.5 w-3.5" />
                <span>{t('detail.contactModal.copyAction')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMarkRoomReadyMutation } from '@/features/rooms/hooks/use-mark-room-ready-mutation';

interface RoomMarkReadyDialogProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  onSuccess: () => void;
}

export const RoomMarkReadyDialog = ({ open, onClose, roomId, roomName, onSuccess }: RoomMarkReadyDialogProps) => {
  const { t } = useTranslation('contracts');
  const markReadyMutation = useMarkRoomReadyMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleConfirm = () => {
    markReadyMutation.mutate(roomId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('markReady.title')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={markReadyMutation.isPending}>
            {t('actions.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            isLoading={markReadyMutation.isPending}
          >
            {t('markReady.confirmBtn')}
          </Button>
        </div>
      }
    >
      <div className="py-2 text-left space-y-2">
        <p className="text-sm text-rentify-text-primary">{t('markReady.desc', { room: roomName })}</p>
        <p className="text-xs text-rentify-text-secondary">{t('markReady.consequence')}</p>
      </div>
    </Dialog>
  );
};

import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteRoomMutation } from '../hooks/use-delete-room-mutation';

interface DeleteRoomDialogProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  onSuccess?: () => void;
}

export const DeleteRoomDialog = ({
  open,
  onClose,
  roomId,
  roomName,
  onSuccess,
}: DeleteRoomDialogProps) => {
  const { t } = useTranslation('rooms');
  const deleteMutation = useDeleteRoomMutation();

  const handleDelete = () => {
    deleteMutation.mutate(roomId, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('delete.title')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {t('cancel')}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
          >
            {t('delete.confirmAction')}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="w-10 h-10 rounded-full bg-rentify-error/10 text-rentify-error flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-rentify-text-primary">
            {t('delete.confirmation', { name: roomName })}
          </p>
          <p className="text-xs text-rentify-text-secondary leading-relaxed">
            {t('delete.warning')}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

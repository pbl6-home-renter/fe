import { useTranslation } from 'react-i18next';
import { DoorOpen } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RoomCreateFormFields } from './room-create-form-fields';
import { useRoomCreateForm } from '../forms/use-room-create-form';
import type { RoomDetailDto } from '../types/room.dto';

interface RoomCreateModalProps {
  open: boolean;
  onClose: () => void;
  buildingId: string;
  buildingName?: string;
  defaultFloor?: number;
  onSuccess?: (room: RoomDetailDto) => void;
}

export const RoomCreateModal = ({
  open,
  onClose,
  buildingId,
  buildingName,
  defaultFloor = 1,
  onSuccess,
}: RoomCreateModalProps) => {
  const { t } = useTranslation('rooms');
  const { form, onSubmit, isSubmitting } = useRoomCreateForm({
    buildingId,
    defaultFloor,
    onSuccess: (room) => {
      onClose();
      onSuccess?.(room);
    },
    onCancel: onClose,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-low text-rentify-primary flex items-center justify-center shrink-0">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-rentify-text-primary truncate">
              {t('create.title', { building: buildingName ? `— ${buildingName}` : '' })}
            </h3>
            <p className="text-xs text-rentify-text-secondary font-normal">
              {t('create.subtitle')}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-rentify-text-secondary">
            {t('create.readyNotice')}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              form="room-create-form"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {t('create.submitAction')}
            </Button>
          </div>
        </div>
      }
    >
      <form id="room-create-form" onSubmit={onSubmit} className="py-1">
        <RoomCreateFormFields form={form} />
      </form>
    </Dialog>
  );
};

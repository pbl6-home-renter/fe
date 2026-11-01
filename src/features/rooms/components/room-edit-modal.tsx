import { useTranslation } from 'react-i18next';
import { Edit3 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRoomEditForm } from '../forms/use-room-edit-form';
import { getFieldError } from '@/lib/form';
import type { RoomDetailDto } from '../types/room.dto';

interface RoomEditModalProps {
  open: boolean;
  onClose: () => void;
  room?: RoomDetailDto;
  onSuccess?: (room: RoomDetailDto) => void;
}

export const RoomEditModal = ({
  open,
  onClose,
  room,
  onSuccess,
}: RoomEditModalProps) => {
  const { t } = useTranslation('rooms');
  const { form, onSubmit, isSubmitting } = useRoomEditForm({
    room,
    onSuccess: (updated) => {
      onClose();
      onSuccess?.(updated);
    },
    onCancel: onClose,
  });

  const { register, formState: { errors } } = form;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-low text-rentify-primary flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-rentify-text-primary truncate">
              {t('edit.title', { name: room?.name || '' })}
            </h3>
            <p className="text-xs text-rentify-text-secondary font-normal">
              {t('edit.subtitle')}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
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
            form="room-edit-form"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {t('edit.submitAction')}
          </Button>
        </div>
      }
    >
      <form id="room-edit-form" onSubmit={onSubmit} className="space-y-4 py-1">
        <Input
          label={t('form.name')}
          required
          error={getFieldError(errors.name, t)}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('form.rentPrice')}
            type="number"
            min={0}
            step={50000}
            required
            error={getFieldError(errors.rentPrice, t)}
            {...register('rentPrice', { valueAsNumber: true })}
          />

          <Input
            label={t('form.area')}
            placeholder="25.0"
            error={getFieldError(errors.area, t)}
            {...register('area')}
          />
        </div>
      </form>
    </Dialog>
  );
};

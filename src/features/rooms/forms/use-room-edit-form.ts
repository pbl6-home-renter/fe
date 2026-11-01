import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateRoomMutation } from '../hooks/use-update-room-mutation';
import { roomUpdateSchema, type RoomUpdateFormData } from './room.schema';
import type { RoomDetailDto, RoomUpdateRequestDto } from '../types/room.dto';

export interface UseRoomEditFormOptions {
  room?: RoomDetailDto;
  onSuccess?: (room: RoomDetailDto) => void;
  onCancel?: () => void;
}

export const useRoomEditForm = ({
  room,
  onSuccess,
  onCancel,
}: UseRoomEditFormOptions) => {
  const updateMutation = useUpdateRoomMutation();

  const form = useForm<RoomUpdateFormData>({
    resolver: zodResolver(roomUpdateSchema),
    defaultValues: {
      name: '',
      rentPrice: 0,
      area: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (room) {
      form.reset({
        name: room.name,
        rentPrice: room.rentPrice,
        area: room.area ?? '',
      });
    }
  }, [room, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!room) return;

    const dirty = form.formState.dirtyFields;
    const payload: RoomUpdateRequestDto = {};

    if (dirty.name && values.name !== undefined) {
      payload.name = values.name;
    }
    if (dirty.rentPrice && values.rentPrice !== undefined) {
      payload.rentPrice = values.rentPrice;
    }
    if (dirty.area && values.area !== undefined) {
      payload.area = values.area || null;
    }

    if (Object.keys(payload).length === 0) {
      onSuccess?.(room);
      return;
    }

    updateMutation.mutate(
      { id: room.id, payload },
      {
        onSuccess: (data) => {
          onSuccess?.(data);
        },
        onError: (error: unknown) => {
          if ((error as { code?: string })?.code === 'DUPLICATE_ROOM') {
            form.setError('name', {
              type: 'server',
              message: 'errors.duplicateRoom',
            });
          }
        },
      }
    );
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: updateMutation.isPending,
  };
};

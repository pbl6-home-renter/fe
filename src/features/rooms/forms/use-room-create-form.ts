import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRoomMutation } from '../hooks/use-create-room-mutation';
import { roomCreateSchema, type RoomCreateFormData } from './room.schema';
import { GenderPolicy } from '../enums/gender-policy.enum';
import { getApiErrorCode } from '@/lib/api/errors';
import type { RoomCreateRequestDto, RoomDetailDto } from '../types/room.dto';

export interface UseRoomCreateFormOptions {
  buildingId: string;
  defaultFloor?: number;
  onSuccess?: (room: RoomDetailDto) => void;
  onCancel?: () => void;
}

export const useRoomCreateForm = ({
  buildingId,
  defaultFloor = 1,
  onSuccess,
  onCancel,
}: UseRoomCreateFormOptions) => {
  const createMutation = useCreateRoomMutation();

  const form = useForm<RoomCreateFormData>({
    resolver: zodResolver(roomCreateSchema),
    defaultValues: {
      buildingId,
      name: '',
      floorNumber: defaultFloor,
      area: '',
      rentPrice: 0,
      depositAmount: 0,
      genderPolicy: GenderPolicy.ANY,
      maxOccupancy: null,
      amenities: {
        aircon: false,
        fridge: false,
        wcInside: false,
        waterHeater: false,
        mezzanine: false,
        table: false,
        chair: false,
      },
    },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload: RoomCreateRequestDto = {
      buildingId,
      name: values.name.trim(),
      floorNumber: Number(values.floorNumber),
      area: String(values.area).trim(),
      rentPrice: Number(values.rentPrice),
      depositAmount: Number(values.depositAmount),
      genderPolicy: values.genderPolicy,
      maxOccupancy: values.maxOccupancy ? Number(values.maxOccupancy) : null,
      amenities: values.amenities,
    };

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        form.reset();
        onSuccess?.(data);
      },
      onError: (error: unknown) => {
        if (getApiErrorCode(error) === 'DUPLICATE_ROOM') {
          form.setError('name', {
            type: 'server',
            message: 'errors.duplicateRoom',
          });
        }
      },
    });
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: createMutation.isPending,
  };
};

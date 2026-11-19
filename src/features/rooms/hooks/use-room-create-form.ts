import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { getErrorMessage } from '@/lib/api/errors';
import { uploadMedia, validateMediaFile } from '@/features/media/utils/upload-media';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { useCreateRoomMutation } from './use-create-room-mutation';
import { roomApi } from '../api/room.api';
import { roomCreateSchema, type RoomCreateFormData } from '../forms/room.schema';
import { GenderPolicy } from '../enums/gender-policy.enum';
import type { RoomCreateRequestDto, RoomDetailDto } from '../types/room.dto';

export interface UseRoomCreateFormOptions {
  buildingId: string;
  defaultFloor?: number;
  onSuccess?: (room: RoomDetailDto) => void;
  onCancel?: () => void;
}

export const useRoomCreateForm = ({ buildingId, defaultFloor = 1, onSuccess }: UseRoomCreateFormOptions) => {
  const { t } = useTranslation('rooms');
  const notify = useNotify();
  const createMutation = useCreateRoomMutation();

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState<{ current: number; total: number } | null>(null);

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

  const addPhotos = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const errCode = validateMediaFile(file, MediaPurpose.GALLERY_PHOTO);
      if (errCode) {
        notify.error(t('errors.photoInvalidType'));
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setPhotos((prev) => [...prev, ...validFiles]);
      setPhotoError(null);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (photos.length === 0) {
      setPhotoError(t('errors.photosRequired'));
      return;
    }

    setIsSubmitting(true);
    setPhotoError(null);

    try {
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

      const createdRoom = await createMutation.mutateAsync(payload);

      const photoMediaIds: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        setUploadStep({ current: i + 1, total: photos.length });
        try {
          const uploaded = await uploadMedia({
            file: photos[i],
            ownerType: MediaOwnerType.ROOM,
            ownerId: createdRoom.id,
            purpose: MediaPurpose.GALLERY_PHOTO,
            skipSuccessToast: true,
            skipErrorToast: true,
          });
          photoMediaIds.push(uploaded.id);
        } catch (uploadErr) {
          notify.error(getErrorMessage(uploadErr));
        }
      }

      let finalRoom = createdRoom;
      if (photoMediaIds.length > 0) {
        try {
          finalRoom = await roomApi.updateRoom(createdRoom.id, { photoMediaIds });
        } catch (linkErr) {
          notify.error(getErrorMessage(linkErr));
        }
      }

      notify.success(t('create.successMessage'));
      form.reset();
      setPhotos([]);
      onSuccess?.(finalRoom);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
      setUploadStep(null);
    }
  });

  return {
    form,
    photos,
    photoError,
    addPhotos,
    removePhoto,
    isSubmitting,
    uploadStep,
    onSubmit,
  };
};

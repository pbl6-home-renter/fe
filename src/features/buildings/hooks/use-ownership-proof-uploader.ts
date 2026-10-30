import { useState, useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { uploadMedia, validateMediaFile } from '@/features/media/utils/upload-media';
import { MEDIA_ERROR_CODES } from '@/features/media/constants/media.constants';
import {
  MediaOwnerType,
  MediaPurpose,
} from '@/features/media/types/media.dto';
import { getErrorMessage } from '@/lib/api/errors';
import type { UploadedMediaItem } from '../types/ownership-proof.types';

export interface UseOwnershipProofUploaderOptions {
  onChange: (ids: string[]) => void;
  buildingId?: string;
}

export const useOwnershipProofUploader = ({
  onChange,
  buildingId = '00000000-0000-0000-0000-000000000000',
}: UseOwnershipProofUploaderOptions) => {
  const { t } = useTranslation('buildings');
  const [items, setItems] = useState<UploadedMediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSingleFile = async (item: UploadedMediaItem): Promise<void> => {
    try {
      const completed = await uploadMedia({
        file: item.file,
        ownerType: MediaOwnerType.BUILDING,
        ownerId: buildingId,
        purpose: MediaPurpose.OWNERSHIP_PROOF,
        skipSuccessToast: true,
        skipErrorToast: true,
      });

      setItems((prev) => {
        const next = prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'completed' as const, mediaId: completed.id, errorMessage: undefined }
            : it
        );
        const completedIds = next
          .filter((it) => it.status === 'completed' && Boolean(it.mediaId))
          .map((it) => it.mediaId as string);
        onChange(completedIds);
        return next;
      });
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || t('uploader.uploadFailed');
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'error' as const, errorMessage: msg }
            : it
        )
      );
      toast.error(msg);
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const validNewItems: UploadedMediaItem[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateMediaFile(file, MediaPurpose.OWNERSHIP_PROOF);
      if (validationError) {
        if (validationError === MEDIA_ERROR_CODES.MEDIA_TYPE_NOT_ALLOWED) {
          toast.error(t('uploader.invalidType', { name: file.name }));
        } else if (validationError === MEDIA_ERROR_CODES.MEDIA_FILE_TOO_LARGE) {
          toast.error(t('uploader.fileTooLarge', { name: file.name }));
        } else {
          toast.error(t('uploader.uploadFailed'));
        }
        return;
      }

      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      validNewItems.push({
        id: tempId,
        file,
        status: 'uploading',
      });
    });

    if (validNewItems.length === 0) return;

    setItems((prev) => [...prev, ...validNewItems]);

    validNewItems.forEach((item) => {
      void uploadSingleFile(item);
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      const completedIds = next
        .filter((it) => it.status === 'completed' && Boolean(it.mediaId))
        .map((it) => it.mediaId as string);
      onChange(completedIds);
      return next;
    });
  };

  const handleRetry = (item: UploadedMediaItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? { ...it, status: 'uploading' as const, errorMessage: undefined }
          : it
      )
    );
    void uploadSingleFile(item);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return {
    items,
    fileInputRef,
    handleFiles,
    handleInputChange,
    handleRemove,
    handleRetry,
    triggerBrowse,
  };
};

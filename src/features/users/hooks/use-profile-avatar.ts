import { useRef, type ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { useAuthStore } from '@/stores/auth-store';
import { USERS_QUERY_KEYS } from '../constants/users.constants';
import type { UserMeResponseDto } from '../types/users.dto';

export const useProfileAvatar = (userId: string) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, isUploading, progress, cancel } = useMediaUpload({
    onSuccess: (completed) => {
      const { user, setUser } = useAuthStore.getState();
      if (user && user.id === userId) {
        const nextUser: UserMeResponseDto = {
          ...user,
          avatarUrl: completed.url,
        };
        setUser(nextUser);
        queryClient.setQueryData(USERS_QUERY_KEYS.ME(userId), nextUser);
      }
    },
  });

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !userId) return;

    upload({
      file,
      ownerType: MediaOwnerType.USER,
      ownerId: userId,
      purpose: MediaPurpose.AVATAR,
    });
  };

  return {
    fileInputRef,
    isUploading,
    progress,
    cancelUpload: cancel,
    openFilePicker,
    handleFileChange,
  };
};

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { notify } from '@/lib/notifications/notify';
import { useRoomQuery } from './use-room-query';
import { GENDER_POLICY_OPTIONS } from '../constants/room.constants';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

export const useRoomPublicDetail = (roomId?: string) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const { data: room, isLoading, isError, refetch } = useRoomQuery(roomId);

  const photos = useMemo(() => {
    if (room?.photoUrls && room.photoUrls.length > 0) {
      return room.photoUrls;
    }
    return [DEFAULT_IMAGE];
  }, [room?.photoUrls]);

  const genderLabel = useMemo(() => {
    if (!room) return '';
    const genderOption = GENDER_POLICY_OPTIONS.find((opt) => opt.value === room.genderPolicy);
    return genderOption ? t(genderOption.labelKey) : room.genderPolicy;
  }, [room, t]);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    setIsFav((prev) => !prev);
    notify.success(isFav ? t('search.removedFav') : t('search.addedFav'));
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    if (!room?.landlord?.id) {
      notify.error(t('detail.contactModal.noLandlordError'));
      return;
    }
    navigate(ROUTES.TENANT.CHAT, {
      state: {
        recipient: {
          id: room.landlord.id,
          name: room.landlord.name || t('search.verifiedLandlord'),
        },
      },
    });
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
      notify.success(t('search.copiedLink'));
    }
  };

  return {
    room,
    isLoading,
    isError,
    refetch,
    photos,
    genderLabel,
    isAuthenticated,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
    isFav,
    authPromptOpen,
    setAuthPromptOpen,
    handleFavoriteClick,
    handleChatClick,
    handleShareClick,
  };
};

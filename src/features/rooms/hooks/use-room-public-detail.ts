import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { notify } from '@/lib/notifications/notify';
import { useRoomQuery } from './use-room-query';
import { useFavoriteRoomsQuery } from './use-favorite-rooms-query';
import { useToggleFavoriteRoom } from './use-toggle-favorite-room';
import { useTenantActiveContracts } from './use-tenant-active-contracts';
import { GENDER_POLICY_OPTIONS } from '../constants/room.constants';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

export const useRoomPublicDetail = (roomId?: string) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const { isAuthenticated, role, isActiveUser } = useAuth();

  const isTenantOrGuest = !isAuthenticated || role === Role.TENANT;

  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const { data: room, isLoading, isError, refetch } = useRoomQuery(roomId);

  const { data: favoriteData } = useFavoriteRoomsQuery(
    { pageSize: 100 },
    { enabled: isAuthenticated && isActiveUser && role === Role.TENANT },
  );

  const isFav = Boolean(roomId && favoriteData?.items?.some((fav) => fav.id === roomId));

  const activeContracts = useTenantActiveContracts({
    enabled: Boolean(isAuthenticated && role === Role.TENANT),
  });

  const myContract = useMemo(() => {
    if (!roomId || !activeContracts.data) return null;
    return activeContracts.data.find((c) => c.roomId === roomId) ?? null;
  }, [roomId, activeContracts.data]);

  const isMyRentedRoom = Boolean(myContract);

  const { toggleFavorite } = useToggleFavoriteRoom();

  const photos = room?.photoUrls && room.photoUrls.length > 0 ? room.photoUrls : [DEFAULT_IMAGE];

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
    if (!roomId) return;
    toggleFavorite({ roomId, isFavorited: isFav });
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
    isTenantOrGuest,
    authPromptOpen,
    setAuthPromptOpen,
    handleFavoriteClick,
    handleChatClick,
    handleShareClick,
    role,
    myContract,
    isMyRentedRoom,
  };
};

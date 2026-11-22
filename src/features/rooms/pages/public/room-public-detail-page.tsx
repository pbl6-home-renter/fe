import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Share2, Heart } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Role } from '@/types/role';
import { BackLink } from '@/components/ui/back-link';
import { IconButton } from '@/components/ui/icon-button';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { RoomPublicGallery } from '../../components/public-detail/room-public-gallery';
import { RoomPublicInfo } from '../../components/public-detail/room-public-info';
import { RoomPublicPricingCard } from '../../components/public-detail/room-public-pricing-card';
import { LoginPromptModal } from '@/features/rooms/components/search/login-prompt-modal';
import { useRoomPublicDetail } from '../../hooks/use-room-public-detail';

export const RoomPublicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t } = useTranslation('rooms');

  const {
    room,
    isLoading,
    isError,
    refetch,
    photos,
    genderLabel,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
    isFav,
    isTenantOrGuest,
    role,
    myContract,
    isMyRentedRoom,
    authPromptOpen,
    setAuthPromptOpen,
    handleFavoriteClick,
    handleChatClick,
    handleShareClick,
  } = useRoomPublicDetail(id);

  const backState = location.state as { from?: string } | null;
  const backTo = backState?.from || (role === Role.TENANT ? ROUTES.TENANT.ROOMS : ROUTES.ROOMS_SEARCH);
  const backLabel =
    backState?.from === ROUTES.TENANT.ROOMS || (!backState?.from && role === Role.TENANT)
      ? t('tenantRoom.backToRooms')
      : t('search.backToSearch');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="h-96 rounded-2xl lg:col-span-7" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <ErrorState title={t('detail.notFoundTitle')} message={t('detail.notFoundDesc')} onRetry={() => void refetch()} />
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <BackLink to={backTo}>{backLabel}</BackLink>

        <div className="flex items-center gap-2">
          <IconButton variant="outline" size="sm" onClick={handleShareClick} aria-label={t('search.pageTitle')}>
            <Share2 className="h-4 w-4" />
          </IconButton>
          {isTenantOrGuest && !isMyRentedRoom && (
            <IconButton
              variant="outline"
              size="sm"
              onClick={handleFavoriteClick}
              aria-label={t('search.pageTitle')}
              className={isFav ? 'text-rentify-danger' : ''}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-rentify-danger text-rentify-danger' : ''}`} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      <RoomPublicGallery
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        onSelectPhoto={setSelectedPhotoIndex}
        roomName={room.name}
        isMyRentedRoom={isMyRentedRoom}
        roomStatus={room.status}
      />

      {/* Main Grid: Left Details (7 cols) + Right Sticky Pricing (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2 pb-6 border-b border-rentify-divider">
            <div className="flex items-center gap-2 text-xs font-semibold text-rentify-primary">
              <Building2 className="h-4 w-4" />
              <span>{room.buildingName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight">
                {room.name}
              </h1>
              {isMyRentedRoom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rentify-primary-container/30 text-rentify-primary border border-rentify-primary/30">
                  <span className="h-2 w-2 rounded-full bg-rentify-primary" />
                  <span>{t('tenantRoom.activeRent')}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary pt-1">
              <MapPin className="h-4 w-4 shrink-0 text-rentify-outline" />
              <span>{room.buildingName}</span>
            </div>
          </div>

          {/* Room Specs, Description & Amenities Info */}
          <RoomPublicInfo room={room} genderLabel={genderLabel} />
        </div>

        {/* Right Sticky Card (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <RoomPublicPricingCard
            room={room}
            isFav={isFav}
            isTenantOrGuest={isTenantOrGuest}
            onChatClick={handleChatClick}
            onFavoriteClick={handleFavoriteClick}
            myContract={myContract}
          />
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <LoginPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </div>
  );
};

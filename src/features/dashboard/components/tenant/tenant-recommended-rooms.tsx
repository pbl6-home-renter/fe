import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { ROUTES } from '@/config/routes.config';
import { formatVnd } from '@/lib/utils/format';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import type { RoomPublicListItemDto } from '@/features/rooms/types/room.dto';

export interface TenantRecommendedRoomsProps {
  isAuthenticated: boolean;
  rooms: RoomPublicListItemDto[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onFavoriteClick: (e: React.MouseEvent, roomId: string) => void;
  onRoomClick: (roomId: string) => void;
}

export const TenantRecommendedRooms = ({
  isAuthenticated,
  rooms,
  isLoading,
  isError,
  onRetry,
  onFavoriteClick,
  onRoomClick,
}: TenantRecommendedRoomsProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { role } = useAuth();
  const isTenantOrGuest = !isAuthenticated || role === Role.TENANT;

  const title = isAuthenticated ? t('tenantHome.recommendedTitleLogged') : t('tenantHome.recommendedTitleGuest');

  if (isLoading) {
    return (
      <div className="space-y-4" role="status">
        <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }, (_, idx) => (
            <Card key={idx} className="p-0 overflow-hidden rounded-2xl h-72">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-2/3 pt-2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (rooms.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{title}</h2>
        <EmptyState title={t('tenantHome.noRoomsTitle')} description={t('tenantHome.noRoomsDesc')} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {rooms.map((room) => {
          const specs = [room.area ? `${room.area} m²` : null, room.district ? `${room.district}` : null]
            .filter(Boolean)
            .join(' · ');
          const photos = (room as unknown as { photoUrls?: string[] }).photoUrls;

          return (
            <Card
              key={room.id}
              variant="interactive"
              onClick={() => onRoomClick(room.id)}
              className="p-0 overflow-hidden rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs hover:border-rentify-primary/40 hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[16/10] w-full bg-rentify-background flex items-center justify-center border-b border-rentify-divider overflow-hidden">
                  {photos && photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt={room.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-rentify-text-muted gap-1">
                      <Home className="w-8 h-8 text-rentify-outline/50" />
                    </div>
                  )}

                  {/* Heart Favorite Button (Hidden for Landlords and Admins) */}
                  {isTenantOrGuest && (
                    <div className="absolute top-2.5 right-2.5">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => onFavoriteClick(e, room.id)}
                        aria-label={t('tenantHome.savedRooms')}
                        className={`h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-rentify-divider hover:bg-white ${
                          room.isFavorited
                            ? 'text-rentify-error fill-rentify-error'
                            : 'text-rentify-text-secondary hover:text-rentify-error'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${room.isFavorited ? 'fill-current' : ''}`} />
                      </IconButton>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors line-clamp-1">
                    {room.name}
                  </h3>

                  {specs && <p className="text-xs text-rentify-text-secondary truncate">{specs}</p>}

                  <div className="pt-2">
                    <span className="text-base sm:text-lg font-extrabold text-teal-primary tabular-nums tracking-tight">
                      {formatVnd(room.rentPrice)}
                    </span>
                    <span className="text-xs font-medium text-rentify-text-secondary ml-1">
                      {t('tenantHome.perMonth')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer action: See more */}
      <div className="pt-4 flex justify-center">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(ROUTES.ROOMS_SEARCH)}
          className="rounded-full px-6 text-xs font-semibold border-rentify-divider hover:border-rentify-primary hover:text-rentify-primary shadow-xs"
        >
          {t('tenantHome.seeMoreRooms')}
        </Button>
      </div>
    </div>
  );
};

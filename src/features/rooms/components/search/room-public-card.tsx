import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Heart, Home, Layers, MapPin, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { formatVnd } from '@/lib/utils/format';
import type { RoomPublicListItemDto } from '../../types/room.dto';
import { GENDER_POLICY_OPTIONS } from '../../constants/room.constants';
import { useToggleFavoriteRoom } from '../../hooks/use-toggle-favorite-room';

export interface RoomPublicCardProps {
  room: RoomPublicListItemDto;
  onRequireAuth: () => void;
}

export const RoomPublicCard = ({ room, onRequireAuth }: RoomPublicCardProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { toggleFavorite } = useToggleFavoriteRoom();

  const isTenantOrGuest = !isAuthenticated || role === Role.TENANT;
  const isFav = Boolean(room.isFavorited);

  const fullLocation = [room.address, room.district, room.province].filter(Boolean).join(', ');

  const genderOption = GENDER_POLICY_OPTIONS.find((opt) => opt.value === room.genderPolicy);
  const genderLabel = genderOption ? t(genderOption.labelKey) : room.genderPolicy;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    toggleFavorite({ roomId: room.id, isFavorited: isFav });
  };

  const handleOpenDetail = () => {
    navigate(ROUTES.ROOM_DETAIL(room.id));
  };

  return (
    <Card
      variant="interactive"
      onClick={handleOpenDetail}
      className="flex h-full flex-col justify-between overflow-hidden p-0 rounded-2xl bg-rentify-card border border-rentify-divider shadow-xs hover:border-rentify-primary/50 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="space-y-4">
        {/* Card Thumbnail Banner */}
        <div className="relative aspect-[16/10] w-full bg-rentify-surface-container-low flex items-center justify-center border-b border-rentify-divider overflow-hidden">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rentify-primary-container/20 text-rentify-primary transition-transform duration-300 group-hover:scale-108">
            <Home className="h-8 w-8" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="success" leadingIcon={<CheckCircle2 className="h-3.5 w-3.5" />}>
              {t('search.availableBadge')}
            </Badge>
          </div>

          {/* Favorite Button (Hidden for Landlords and Admins) */}
          {isTenantOrGuest && (
            <div className="absolute top-3 right-3">
              <IconButton
                variant="outline"
                size="sm"
                onClick={handleFavoriteClick}
                aria-label={t('search.favoriteButton')}
                className={`h-8 w-8 rounded-full backdrop-blur-md bg-rentify-surface/90 border-rentify-divider transition-colors ${
                  isFav
                    ? 'text-rentify-danger fill-rentify-danger'
                    : 'text-rentify-text-secondary hover:text-rentify-danger'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
              </IconButton>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 pt-0 space-y-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-teal-primary tabular-nums tracking-tight">
                {formatVnd(room.rentPrice)}
              </span>
              <span className="text-xs font-medium text-rentify-text-secondary">{t('search.monthUnit')}</span>
            </div>

            <h3 className="text-base font-bold text-rentify-text-primary line-clamp-1 mt-1 group-hover:text-rentify-primary transition-colors">
              {room.name}
            </h3>

            {fullLocation && (
              <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary mt-1.5 line-clamp-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-rentify-outline" />
                <span className="truncate">{fullLocation}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-rentify-divider">
            {room.area && (
              <Badge variant="default" className="gap-1 text-xs">
                <Layers className="h-3 w-3" />
                <span>{t('search.areaUnit', { area: room.area })}</span>
              </Badge>
            )}

            {genderLabel && (
              <Badge variant="secondary" className="text-xs">
                {genderLabel}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-rentify-text-secondary pt-2 border-t border-rentify-divider">
          <div className="flex items-center gap-1 text-rentify-primary font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-rentify-success" />
            <span>{t('search.verifiedLandlord')}</span>
          </div>
          <span className="text-[11px] text-rentify-outline">{t('search.availableBadge')}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenDetail}
          className="w-full justify-between hover:border-rentify-primary hover:text-rentify-primary group-hover:bg-rentify-primary group-hover:text-rentify-surface transition-all"
        >
          <span>{t('search.viewDetail')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
};

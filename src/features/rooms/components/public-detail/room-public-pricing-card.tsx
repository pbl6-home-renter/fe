import { useTranslation } from 'react-i18next';
import { FileCheck, Heart, Shield, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatVnd } from '@/lib/utils/format';
import type { RoomDetailDto } from '../../types/room.dto';

export interface RoomPublicPricingCardProps {
  room: RoomDetailDto;
  isFav: boolean;
  onFavoriteClick: () => void;
  onChatClick?: () => void;
}

export const RoomPublicPricingCard = ({ room, isFav, onFavoriteClick, onChatClick }: RoomPublicPricingCardProps) => {
  const { t } = useTranslation('rooms');

  return (
    <Card className="p-6 sm:p-7 rounded-3xl space-y-6 bg-rentify-card border border-rentify-divider shadow-sm">
      {/* Price section */}
      <div>
        <span className="text-xs text-rentify-text-secondary font-medium">{t('detail.pricing.listedPrice')}</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-3xl font-black text-rentify-primary tabular-nums">{formatVnd(room.rentPrice)}</span>
          <span className="text-xs text-rentify-text-secondary font-medium">{t('search.monthUnit')}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-rentify-divider text-xs text-rentify-text-secondary">
          <span>{t('detail.pricing.deposit')}</span>
          <span className="font-semibold text-rentify-text-primary">{formatVnd(room.depositAmount)}</span>
        </div>
      </div>

      {/* Landlord Information Box */}
      <div className="p-4 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 space-y-3">
        <span className="text-[11px] font-bold text-rentify-text-secondary uppercase tracking-wider block">
          {t('detail.pricing.landlordTitle')}
        </span>
        <div className="flex items-center gap-3">
          <Avatar name={room.landlord?.name || 'Rentify'} size="md" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-rentify-text-primary">
              {room.landlord?.name || t('search.verifiedLandlord')}
            </div>
            <Badge variant="success" leadingIcon={<Shield className="h-3 w-3" />}>
              {t('detail.pricing.verifiedBadge')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <Button variant="primary" className="w-full h-11 text-sm font-bold shadow-sm gap-2" onClick={onChatClick}>
          <MessageSquare className="h-4 w-4" />
          <span>{t('detail.pricing.chatAction')}</span>
        </Button>

        <Button variant="outline" className="w-full h-10 text-xs font-semibold gap-2" onClick={onFavoriteClick}>
          <Heart className={`h-4 w-4 ${isFav ? 'text-rentify-danger fill-rentify-danger' : ''}`} />
          <span>{isFav ? t('detail.pricing.savedAction') : t('detail.pricing.saveAction')}</span>
        </Button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2 text-[11px] text-rentify-text-secondary leading-relaxed pt-2 border-t border-rentify-divider">
        <FileCheck className="h-4 w-4 text-rentify-primary shrink-0 mt-0.5" />
        <span>{t('detail.pricing.contractNotice')}</span>
      </div>
    </Card>
  );
};

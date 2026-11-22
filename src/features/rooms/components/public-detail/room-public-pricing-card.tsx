import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, FileCheck, FileText, Heart, MessageSquare, Receipt, Shield, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ROUTES } from '@/config/routes.config';
import { formatDate, formatVnd } from '@/lib/utils/format';
import type { RoomDetailDto } from '../../types/room.dto';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';

export interface RoomPublicPricingCardProps {
  room: RoomDetailDto;
  isFav: boolean;
  isTenantOrGuest?: boolean;
  onFavoriteClick: () => void;
  onChatClick?: () => void;
  myContract?: MyContractListItemDto | null;
}

export const RoomPublicPricingCard = ({
  room,
  isFav,
  isTenantOrGuest = true,
  onFavoriteClick,
  onChatClick,
  myContract,
}: RoomPublicPricingCardProps) => {
  const { t } = useTranslation(['rooms', 'common']);
  const navigate = useNavigate();

  // If the tenant is currently renting this room
  if (myContract) {
    return (
      <Card className="p-6 sm:p-7 rounded-3xl space-y-6 bg-rentify-card border border-rentify-divider shadow-sm">
        {/* Rented Status Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-rentify-divider">
          <Badge variant="success" leadingIcon={<CheckCircle2 className="h-3.5 w-3.5" />}>
            {t('tenantRoom.activeRent')}
          </Badge>
          <span className="text-xs font-mono text-rentify-text-secondary">
            {t('tenantRoom.contractCode', { code: myContract.contractCode })}
          </span>
        </div>

        {/* Price section */}
        <div className="space-y-2">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('tenantRoom.rentPriceLabel')}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rentify-primary tabular-nums">
              {formatVnd(myContract.rentPrice)}
            </span>
            <span className="text-xs text-rentify-text-secondary font-medium">{t('tenantRoom.monthUnit')}</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-rentify-divider text-xs text-rentify-text-secondary">
            <span>{t('detail.pricing.deposit')}</span>
            <span className="font-semibold text-rentify-text-primary">{formatVnd(myContract.depositAmount)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-rentify-text-secondary">
            <span>{t('tenantRoom.contractTimelineTitle')}</span>
            <span className="font-medium text-rentify-text-primary">
              {formatDate(myContract.startDate)} – {formatDate(myContract.endDate)}
            </span>
          </div>
        </div>

        {/* Landlord Information Box */}
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/70 border border-rentify-divider/50 space-y-3">
          <span className="text-[11px] font-bold text-rentify-text-secondary uppercase tracking-wider block">
            {t('detail.pricing.landlordTitle')}
          </span>
          <div className="flex items-center justify-between gap-3">
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
            {onChatClick && (
              <Button variant="outline" size="sm" onClick={onChatClick} className="gap-1.5 text-xs shrink-0">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{t('common:navigation.chat')}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tenant Quick Actions for this rented room */}
        <div className="space-y-2">
          <Button
            variant="primary"
            className="w-full h-10 text-xs font-bold gap-2"
            onClick={() => navigate(ROUTES.TENANT.CONTRACT_DETAIL(myContract.id))}
          >
            <FileText className="h-4 w-4" />
            <span>{t('tenantRoom.viewContract')}</span>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full h-9 text-xs font-semibold gap-1.5"
              onClick={() => navigate(ROUTES.TENANT.INVOICES)}
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>{t('tenantRoom.viewInvoices')}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-9 text-xs font-semibold gap-1.5"
              onClick={() => navigate(ROUTES.TENANT.ISSUES)}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>{t('common:navigation.issues')}</span>
            </Button>
          </div>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 text-[11px] text-rentify-text-secondary leading-relaxed pt-2 border-t border-rentify-divider">
          <FileCheck className="h-4 w-4 text-rentify-success shrink-0 mt-0.5" />
          <span>{t('tenantRoom.contractVerifiedNotice')}</span>
        </div>
      </Card>
    );
  }

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

        {isTenantOrGuest && (
          <Button variant="outline" className="w-full h-10 text-xs font-semibold gap-2" onClick={onFavoriteClick}>
            <Heart className={`h-4 w-4 ${isFav ? 'text-rentify-danger fill-rentify-danger' : ''}`} />
            <span>{isFav ? t('detail.pricing.savedAction') : t('detail.pricing.saveAction')}</span>
          </Button>
        )}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2 text-[11px] text-rentify-text-secondary leading-relaxed pt-2 border-t border-rentify-divider">
        <FileCheck className="h-4 w-4 text-rentify-primary shrink-0 mt-0.5" />
        <span>{t('detail.pricing.contractNotice')}</span>
      </div>
    </Card>
  );
};

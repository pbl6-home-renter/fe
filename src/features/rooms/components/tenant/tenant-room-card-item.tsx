import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, CheckCircle2, Eye, Home, MapPin, Maximize2, Receipt, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/routes.config';
import { formatVnd } from '@/lib/utils/format';
import type { RoomHubItemDto } from '../../types/room.dto';
import { TenantRoomCardTimeline } from './tenant-room-card-timeline';

export interface TenantRoomCardItemProps {
  room: RoomHubItemDto;
}

export const TenantRoomCardItem = ({ room }: TenantRoomCardItemProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const fullAddress = [room.address, room.ward, room.province].filter(Boolean).join(', ');

  return (
    <Card className="rounded-3xl border border-rentify-divider bg-rentify-card shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Room Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-rentify-divider">
        <div className="flex items-start gap-4 min-w-0">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rentify-primary-container/20 text-rentify-primary shadow-xs">
            <Home className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                onClick={() => navigate(ROUTES.ROOM_DETAIL(room.roomId), { state: { from: ROUTES.TENANT.ROOMS } })}
                className="text-xl sm:text-2xl font-bold tracking-tight text-rentify-text-primary hover:text-rentify-primary cursor-pointer transition-colors truncate"
              >
                {room.roomName}
              </h2>
              <Badge
                variant="success"
                leadingIcon={<span className="h-1.5 w-1.5 rounded-full bg-rentify-success shrink-0" />}
              >
                {t('tenantRoom.activeRent')}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-rentify-text-secondary">
              <div className="flex items-center gap-1.5 font-medium text-rentify-text-primary">
                <Building2 className="h-4 w-4 shrink-0 text-rentify-outline" />
                <span>{room.buildingName}</span>
              </div>
              {fullAddress && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-rentify-text-secondary truncate max-w-md">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-rentify-outline" />
                    <span className="truncate">{fullAddress}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1 shrink-0">
          <span className="text-xs text-rentify-text-secondary font-medium">{t('tenantRoom.rentPriceLabel')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-rentify-primary">{formatVnd(room.rentPrice)}</span>
            <span className="text-xs text-rentify-text-secondary">{t('tenantRoom.monthUnit')}</span>
          </div>
        </div>
      </div>

      {/* Contract Timeline and Progress Meter */}
      <TenantRoomCardTimeline startDate={room.startDate} endDate={room.endDate} />

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('tenantRoom.metricInvoicesTitle')}
            </span>
            <Receipt className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rentify-success" />
              <span className="text-xs font-medium text-rentify-text-primary">{t('tenantRoom.activeRent')}</span>
            </div>
            <div className="text-base font-bold text-rentify-text-primary mt-1">{formatVnd(room.rentPrice)}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">{t('tenantRoom.areaLabel')}</span>
            <Maximize2 className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="text-base font-bold text-rentify-text-primary mt-1">
              {room.area ? t('tenantRoom.areaValue', { area: room.area }) : t('tenantRoom.areaEmpty')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rentify-surface-container-low/50 border border-rentify-divider/50 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rentify-text-secondary">
              {t('tenantRoom.metricSupportTitle')}
            </span>
            <Wrench className="h-4 w-4 text-rentify-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rentify-success" />
              <span className="text-xs font-medium text-rentify-text-primary">{t('tenantRoom.supportActive')}</span>
            </div>
            <div className="text-xs text-rentify-text-secondary mt-1">{t('tenantRoom.supportHint')}</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rentify-divider">
        <div className="flex items-center gap-2 text-xs text-rentify-text-secondary">
          <CheckCircle2 className="h-4 w-4 text-rentify-success shrink-0" />
          <span>{t('tenantRoom.contractVerifiedNotice')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ROOM_DETAIL(room.roomId), { state: { from: ROUTES.TENANT.ROOMS } })}
            className="gap-1.5 flex-1 sm:flex-initial text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('tenantRoom.viewRoomDetail')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.TENANT.INVOICES)}
            className="gap-1.5 flex-1 sm:flex-initial text-xs"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>{t('tenantRoom.viewInvoices')}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.TENANT.CONTRACT_DETAIL(room.contractId))}
            className="gap-1.5 flex-1 sm:flex-initial text-xs"
          >
            <span>{t('tenantRoom.viewContract')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

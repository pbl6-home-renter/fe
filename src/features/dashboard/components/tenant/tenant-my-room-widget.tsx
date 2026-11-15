import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, ChevronRight, Home, MapPin, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ROUTES } from '@/config/routes.config';
import { formatDate } from '@/lib/utils/format';
import { calculateContractTimeline } from '@/features/rooms/utils/contract-timeline';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import type { TenantInvoiceListItemDto } from '@/features/invoices/types/invoices.dto';
import { TenantMyRoomInvoice } from './tenant-my-room-invoice';

export interface TenantMyRoomWidgetProps {
  contracts: MyContractListItemDto[];
  activeContract: MyContractListItemDto;
  invoice?: TenantInvoiceListItemDto;
  activeRoomIndex: number;
  onPrevRoom: () => void;
  onNextRoom: () => void;
}

export const TenantMyRoomWidget = ({
  contracts,
  activeContract,
  invoice,
  activeRoomIndex,
  onPrevRoom,
  onNextRoom,
}: TenantMyRoomWidgetProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const timeline = calculateContractTimeline(activeContract.startDate, activeContract.endDate);

  const handleCardClick = () => {
    navigate(ROUTES.TENANT.ROOM_DETAIL(activeContract.roomId));
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.TENANT.CHAT);
  };

  const handleIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.TENANT.ISSUES);
  };

  const handleInvoiceAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (invoice) {
      navigate(ROUTES.TENANT.INVOICE_DETAIL(invoice.id));
    } else {
      navigate(ROUTES.TENANT.INVOICES);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{t('tenantHome.myRoomTitle')}</h2>

        {/* Carousel controls if ≥ 2 rooms */}
        {contracts.length > 1 && (
          <div className="flex items-center gap-2">
            {contracts.length <= 5 ? (
              <div className="flex items-center gap-1.5 px-2">
                {contracts.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      idx === activeRoomIndex ? 'w-5 bg-rentify-primary' : 'w-2 bg-rentify-divider'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs font-bold text-rentify-text-secondary tabular-nums">
                {t('tenantHome.roomCounter', { current: activeRoomIndex + 1, total: contracts.length })}
              </span>
            )}

            <IconButton variant="outline" size="sm" onClick={onPrevRoom} aria-label={t('tenantHome.prevRoom')}>
              <ChevronLeft className="w-4 h-4" />
            </IconButton>
            <IconButton variant="outline" size="sm" onClick={onNextRoom} aria-label={t('tenantHome.nextRoom')}>
              <ChevronRight className="w-4 h-4" />
            </IconButton>
          </div>
        )}
      </div>

      <Card
        variant="interactive"
        onClick={handleCardClick}
        className="p-5 sm:p-6 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs hover:border-rentify-primary/40 hover:shadow-card transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-stretch"
      >
        {/* Left Side: Room Image Thumbnail */}
        <div className="relative w-full md:w-56 shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-rentify-background border border-rentify-divider flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-rentify-text-muted gap-2">
            <Home className="w-8 h-8 text-rentify-primary" />
            <span className="text-xs font-medium text-rentify-text-secondary">{activeContract.roomName}</span>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-rentify-success shadow-xs border border-rentify-divider">
              <span className="h-1.5 w-1.5 rounded-full bg-rentify-success" />
              <span>{t('tenantHome.rentingBadge')}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
          {/* Header row */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-rentify-text-primary tracking-tight truncate">
              {activeContract.roomName} · {activeContract.buildingName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-rentify-text-secondary mt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rentify-outline" />
                <span className="truncate">{activeContract.buildingName}</span>
              </span>
              <span>•</span>
              <span>{t('tenantHome.landlordLabel', { name: activeContract.buildingName })}</span>
            </div>
          </div>

          {/* Invoice section */}
          <TenantMyRoomInvoice
            invoice={invoice}
            fallbackRentPrice={activeContract.rentPrice}
            onInvoiceAction={handleInvoiceAction}
          />

          {/* Timeline bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
              <span>{t('tenantHome.rentalDuration')}</span>
              <span className="font-semibold text-rentify-text-primary">
                {t('tenantHome.contractUntil', { date: formatDate(activeContract.endDate) })}
              </span>
            </div>
            <div className="w-full bg-rentify-divider/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${timeline.percent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleChat}
              className="flex-1 text-xs font-medium rounded-xl border border-rentify-divider/50 hover:border-rentify-primary"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              <span>{t('tenantHome.chatLandlord')}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleIssue}
              className="flex-1 text-xs font-medium rounded-xl border border-rentify-divider/50 hover:border-rentify-primary"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              <span>{t('tenantHome.reportIssue')}</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Receipt, Search, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes.config';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import type { RoomHubItemDto } from '../../types/room.dto';
import { TenantRoomCardItem } from './tenant-room-card-item';

export interface TenantRoomCardsProps {
  rooms?: RoomHubItemDto[];
  contracts?: MyContractListItemDto[];
}

export const TenantRoomCards = ({ rooms, contracts }: TenantRoomCardsProps) => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const displayRooms: RoomHubItemDto[] = useMemo(() => {
    if (rooms) return rooms;
    if (contracts) {
      return contracts.map((c) => ({
        contractId: c.id,
        roomId: c.roomId,
        roomName: c.roomName,
        area: null,
        buildingId: '',
        buildingName: c.buildingName,
        address: '',
        ward: '',
        province: '',
        rentPrice: c.rentPrice,
        startDate: c.startDate,
        endDate: c.endDate,
      }));
    }
    return [];
  }, [rooms, contracts]);

  return (
    <div className="space-y-8">
      {/* Active Room Hub Cards */}
      <div className="space-y-6">
        {displayRooms.map((room) => (
          <TenantRoomCardItem key={room.contractId} room={room} />
        ))}
      </div>

      {/* Secondary Quick Navigation Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card
          variant="interactive"
          onClick={() => navigate(ROUTES.TENANT.INVOICES)}
          className="p-5 rounded-2xl flex items-start gap-3.5 cursor-pointer hover:border-rentify-primary transition-colors"
        >
          <div className="p-3 rounded-xl bg-rentify-primary-container/20 text-rentify-primary shrink-0">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rentify-text-primary">{t('tenantRoom.quickInvoicesTitle')}</h4>
            <p className="text-xs text-rentify-text-secondary mt-1 leading-relaxed">
              {t('tenantRoom.quickInvoicesDesc')}
            </p>
          </div>
        </Card>

        <Card
          variant="interactive"
          onClick={() => navigate(ROUTES.TENANT.ISSUES)}
          className="p-5 rounded-2xl flex items-start gap-3.5 cursor-pointer hover:border-rentify-primary transition-colors"
        >
          <div className="p-3 rounded-xl bg-rentify-primary-container/20 text-rentify-primary shrink-0">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rentify-text-primary">{t('tenantRoom.quickIssuesTitle')}</h4>
            <p className="text-xs text-rentify-text-secondary mt-1 leading-relaxed">
              {t('tenantRoom.quickIssuesDesc')}
            </p>
          </div>
        </Card>

        <Card
          variant="interactive"
          onClick={() => navigate(ROUTES.ROOMS_SEARCH)}
          className="p-5 rounded-2xl flex items-start gap-3.5 cursor-pointer hover:border-rentify-primary transition-colors"
        >
          <div className="p-3 rounded-xl bg-rentify-primary-container/20 text-rentify-primary shrink-0">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rentify-text-primary">{t('tenantRoom.quickSearchTitle')}</h4>
            <p className="text-xs text-rentify-text-secondary mt-1 leading-relaxed">
              {t('tenantRoom.quickSearchDesc')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

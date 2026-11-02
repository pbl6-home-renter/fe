import { useTranslation } from 'react-i18next';
import { Building2, Calendar, Car, CreditCard, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useRoomQuery } from '@/features/rooms/hooks/use-room-query';
import { formatDate, formatVnd } from '@/lib/utils/format';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractInfoCardProps {
  contract: ContractDetailDto;
}

export const ContractInfoCard = ({ contract }: ContractInfoCardProps) => {
  const { t } = useTranslation('contracts');
  const roomQuery = useRoomQuery(contract.roomId);
  const room = roomQuery.data;

  const displayRoomName = contract.roomName || room?.name || '—';
  const displayBuildingName = room?.buildingName || '';

  return (
    <Card className="space-y-5 p-5">
      <div className="flex items-center gap-2 border-b border-rentify-divider pb-3">
        <FileText className="h-5 w-5 text-rentify-primary" />
        <h2 className="font-semibold text-rentify-text-primary">
          {t('detail.infoTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Room & Building */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <Building2 className="h-3.5 w-3.5" />
            <span>{t('detail.roomAndBuilding')}</span>
          </div>
          <p className="font-semibold text-rentify-text-primary">
            {displayRoomName}
          </p>
          {displayBuildingName && (
            <p className="text-xs text-rentify-text-secondary">
              {displayBuildingName}
            </p>
          )}
        </div>

        {/* Representative */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <User className="h-3.5 w-3.5" />
            <span>{t('detail.representative')}</span>
          </div>
          <p className="font-semibold text-rentify-text-primary">
            {contract.tenantName || '—'}
          </p>
          <p className="text-xs text-rentify-text-secondary">
            {contract.tenantPhone || '—'}
          </p>
        </div>

        {/* Rent & Deposit */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <CreditCard className="h-3.5 w-3.5" />
            <span>{t('detail.rentAndDeposit')}</span>
          </div>
          <p className="font-semibold text-rentify-text-primary">
            {formatVnd(contract.rentPrice)} {t('detail.perMonth')}
          </p>
          <p className="text-xs text-rentify-text-secondary">
            {t('detail.depositAmount', { amount: formatVnd(contract.depositAmount) })}
          </p>
        </div>

        {/* Term */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            <span>{t('detail.duration')}</span>
          </div>
          <p className="text-sm font-semibold text-rentify-text-primary">
            {formatDate(contract.startDate)} – {formatDate(contract.endDate)}
          </p>
        </div>

        {/* Vehicles */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <Car className="h-3.5 w-3.5" />
            <span>{t('detail.vehicles')}</span>
          </div>
          <p className="text-sm font-semibold text-rentify-text-primary">
            {contract.vehicleCount !== null && contract.vehicleCount !== undefined
              ? t('detail.vehicleUnit', { count: contract.vehicleCount })
              : t('detail.noVehicles')}
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
            <FileText className="h-3.5 w-3.5" />
            <span>{t('detail.notes')}</span>
          </div>
          <p className="line-clamp-3 text-xs text-rentify-text-primary">
            {contract.description || t('detail.noNotes')}
          </p>
        </div>
      </div>
    </Card>
  );
};

import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Card } from '@/components/ui/card';
import { ContractStatusBadge } from '@/features/contracts/components/contract-status-badge';
import { formatDate } from '@/lib/utils/format';
import { useRoomContractData } from '../../hooks/use-room-contract-data';

export const RoomTenantContractCard = ({ roomId }: { roomId: string }) => {
  const { t } = useTranslation('rooms');
  const { contract, contractQuery, membersQuery } = useRoomContractData(roomId);
  return (
    <Card className="space-y-4">
      <h3 className="font-bold text-base text-rentify-text-primary">{t('detail.contractTitle')}</h3>
      {contractQuery.isLoading ? <Skeleton className="h-20 w-full" /> : contractQuery.isError ? (
        <ErrorState onRetry={() => void contractQuery.refetch()} />
      ) : !contract ? (
        <p className="text-sm text-rentify-text-secondary">{t('detail.noContract')}</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{contract.contractCode}</span>
            <ContractStatusBadge status={contract.status} />
          </div>
          <p>{t('detail.contractPeriod')}: {formatDate(contract.startDate)} – {formatDate(contract.endDate)}</p>
          <h4 className="font-semibold">{t('detail.membersTitle')}</h4>
          {membersQuery.isLoading ? <Skeleton className="h-12 w-full" /> : membersQuery.isError ? (
            <ErrorState onRetry={() => void membersQuery.refetch()} />
          ) : membersQuery.data?.length ? (
            <ul className="space-y-2">
              {membersQuery.data.map((member) => <li key={member.id} className="rounded-xl bg-surface-container-low p-3">{member.tenantName}{member.tenantPhone ? ` · ${member.tenantPhone}` : ''}</li>)}
            </ul>
          ) : <p className="text-rentify-text-secondary">{t('detail.noMembers')}</p>}
        </div>
      )}
    </Card>
  );
};

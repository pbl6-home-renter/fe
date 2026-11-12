import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, UserMinus, UserPlus, Users, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { EmptyState } from '@/components/feedback/empty-state';
import { formatDate } from '@/lib/utils/format';
import { ContractStatus } from '../../enums/contract-status.enum';
import { useContractMembersQuery } from '../../hooks/use-contract-members-query';
import { useLeaveMemberModal } from '../../hooks/use-leave-member-modal';
import { AddMemberModal } from './add-member-modal';
import { LeaveMemberModal } from './leave-member-modal';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractMembersCardProps {
  contract: ContractDetailDto;
}

export const ContractMembersCard = ({ contract }: ContractMembersCardProps) => {
  const { t } = useTranslation('contracts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } = useContractMembersQuery(contract.id);
  const members = data?.items ?? [];

  const leaveModal = useLeaveMemberModal({
    contract,
    onSuccess: () => void refetch(),
  });

  const isActiveContract = contract.status === ContractStatus.ACTIVE;
  const activeMembers = members.filter((m) => m.status === 'active');
  const leftMembers = members.filter((m) => m.status === 'left');

  return (
    <Card className="p-5 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-rentify-divider pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rentify-primary-container text-rentify-primary">
            {isFetching && !isLoading ? <LoadingSpinner size="sm" /> : <Users className="h-4 w-4" />}
          </div>
          <div>
            <h2 className="font-semibold text-rentify-text-primary text-base">{t('members.title')}</h2>
            <p className="text-xs text-rentify-text-secondary">{t('members.description')}</p>
          </div>
        </div>

        {isActiveContract && (
          <Button type="button" variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span>{t('members.addBtn')}</span>
          </Button>
        )}
      </div>

      {!isActiveContract && (
        <AlertBanner variant="info" title={t('members.notActiveNotice')}>
          {t('members.notActiveDesc')}
        </AlertBanner>
      )}

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label={t('members.title')}>
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError && !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <div className="space-y-6">
          {/* Active Members Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-rentify-success" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-rentify-text-secondary">
                {t('members.activeGroup')} ({activeMembers.length})
              </h3>
            </div>

            {activeMembers.length === 0 ? (
              <EmptyState
                icon={Users}
                title={t('members.emptyActiveTitle')}
                description={t('members.emptyActiveDesc')}
                actionText={isActiveContract ? t('members.addBtn') : undefined}
                onAction={isActiveContract ? () => setIsAddModalOpen(true) : undefined}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-rentify-divider bg-rentify-background hover:border-rentify-outline/40 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <p className="font-semibold text-rentify-text-primary text-sm truncate">
                        {member.tenantName || '—'}
                      </p>
                      <p className="text-xs text-rentify-text-secondary">{member.tenantPhone || '—'}</p>
                      <p className="text-[11px] text-rentify-text-secondary">
                        {t('members.joinedDate')}:{' '}
                        <span className="font-medium text-rentify-text-primary">{formatDate(member.joinedAt)}</span>
                      </p>
                    </div>

                    {isActiveContract && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => leaveModal.handleOpen(member)}
                        className="gap-1 text-xs shrink-0 text-rentify-error hover:text-rentify-error hover:border-rentify-error/40"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>{t('members.leaveBtn')}</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departed Members Section */}
          {leftMembers.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-rentify-divider">
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-rentify-text-secondary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rentify-text-secondary">
                  {t('members.leftGroup')} ({leftMembers.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80">
                {leftMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-rentify-text-primary">{member.tenantName || '—'}</span>
                      <Badge variant="secondary">{t('members.leftBadge')}</Badge>
                    </div>
                    <p className="text-rentify-text-secondary">{member.tenantPhone || '—'}</p>
                    <p className="text-[11px] text-rentify-text-secondary">
                      {t('members.stayDuration', {
                        from: formatDate(member.joinedAt),
                        to: member.leftAt ? formatDate(member.leftAt) : '—',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AddMemberModal
        contract={contract}
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => void refetch()}
      />

      <LeaveMemberModal
        member={leaveModal.selectedMember}
        open={leaveModal.isOpen}
        onClose={leaveModal.handleClose}
        onSubmit={leaveModal.handleSubmit}
        form={leaveModal.form}
        isSubmitting={leaveModal.isSubmitting}
        maxDate={contract.endDate}
      />
    </Card>
  );
};

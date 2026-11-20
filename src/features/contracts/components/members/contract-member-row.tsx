import { useTranslation } from 'react-i18next';
import { UserCheck, UserMinus, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/format';
import { UserAvatar } from '@/features/users/components/user-avatar';
import type { ContractMemberListItemDto } from '../../types/contract-member.dto';

interface ContractMemberRowProps {
  member: ContractMemberListItemDto;
  isActiveContract: boolean;
  onLeave: (member: ContractMemberListItemDto) => void;
}

export const ContractMemberRow = ({ member, isActiveContract, onLeave }: ContractMemberRowProps) => {
  const { t } = useTranslation('contracts');

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-rentify-divider bg-rentify-background hover:border-rentify-outline/40 transition-colors">
      <div className="flex min-w-0 items-center gap-3 pr-2">
        <UserAvatar name={member.tenantName} src={member.tenantAvatarUrl} size="md" />
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-rentify-text-primary text-sm truncate">{member.tenantName || '—'}</p>
            {member.tenantId ? (
              <Badge
                variant="success"
                className="text-[10px] py-0 px-1.5"
                leadingIcon={<UserCheck className="w-2.5 h-2.5" />}
              >
                {t('members.linkedBadge')}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[10px] py-0 px-1.5 text-rentify-text-secondary"
                leadingIcon={<UserX className="w-2.5 h-2.5" />}
              >
                {t('members.unlinkedBadge')}
              </Badge>
            )}
          </div>
          <p className="text-xs text-rentify-text-secondary">{member.tenantPhone || '—'}</p>
          <p className="text-[11px] text-rentify-text-secondary">
            {t('members.joinedDate')}:{' '}
            <span className="font-medium text-rentify-text-primary">{formatDate(member.joinedAt)}</span>
          </p>
        </div>
      </div>

      {isActiveContract && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onLeave(member)}
          className="gap-1 text-xs shrink-0 text-rentify-error hover:text-rentify-error hover:border-rentify-error/40"
        >
          <UserMinus className="w-3.5 h-3.5" />
          <span>{t('members.leaveBtn')}</span>
        </Button>
      )}
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { StatusDot } from '@/components/ui/status-dot';
import { UserStatus } from '@/types/user';

export interface UserStatusBadgeProps {
  status: UserStatus | string;
  className?: string;
}

export const UserStatusBadge = ({ status, className }: UserStatusBadgeProps) => {
  const { t } = useTranslation('users');

  const isLocked = status === UserStatus.LOCKED;
  const label = isLocked ? t('status.locked') : t('status.active');
  const variant = isLocked ? 'error' : 'success';

  return <StatusDot variant={variant} label={label} className={className} />;
};

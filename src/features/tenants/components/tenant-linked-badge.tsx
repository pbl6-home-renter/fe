import { useTranslation } from 'react-i18next';
import { ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface TenantLinkedBadgeProps {
  isLinked: boolean;
  className?: string;
}

export const TenantLinkedBadge = ({ isLinked, className }: TenantLinkedBadgeProps) => {
  const { t } = useTranslation('tenants');

  return (
    <Badge
      variant={isLinked ? 'primary' : 'default'}
      className={className}
      leadingIcon={
        isLinked ? (
          <ShieldCheck className="h-3.5 w-3.5 text-rentify-primary" />
        ) : (
          <User className="h-3.5 w-3.5 text-rentify-text-secondary" />
        )
      }
    >
      {isLinked ? t('account.linked') : t('account.notLinked')}
    </Badge>
  );
};

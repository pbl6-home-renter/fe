import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { ContractTenantScope } from '../types/tenant.dto';

export interface TenantScopeBadgeProps {
  scope: ContractTenantScope;
  className?: string;
}

export const TenantScopeBadge = ({ scope, className }: TenantScopeBadgeProps) => {
  const { t } = useTranslation('tenants');

  const isCurrent = scope === 'current';

  return (
    <Badge
      variant={isCurrent ? 'success' : 'default'}
      className={className}
      leadingIcon={
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', isCurrent ? 'bg-rentify-success' : 'bg-rentify-outline')}
        />
      }
    >
      {isCurrent ? t('scope.current') : t('scope.history')}
    </Badge>
  );
};

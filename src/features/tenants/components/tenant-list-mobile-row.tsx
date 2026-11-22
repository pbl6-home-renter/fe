import type { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { TenantScopeBadge } from './tenant-scope-badge';
import { TenantLinkedBadge } from './tenant-linked-badge';
import type { ContractTenantListItemDto } from '../types/tenant.dto';

export const TenantListMobileRow = ({ row }: { row: Row<ContractTenantListItemDto> }) => {
  const { t } = useTranslation('tenants');
  const tenant = row.original;
  const displayName = tenant.tenantName || t('detail.unnamedTenant');

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            src={tenant.avatarUrl}
            name={displayName}
            size="md"
            colorSeed={tenant.contractMemberId}
            className="shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-rentify-text-primary">{displayName}</p>
            <p className="mt-0.5 text-xs text-rentify-text-secondary">
              {t('detail.totalContracts', { count: tenant.contractCount })}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-rentify-text-muted shrink-0 mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rentify-divider">
        <TenantScopeBadge scope={tenant.scope} />
        <TenantLinkedBadge isLinked={tenant.isLinked} />
      </div>
    </div>
  );
};

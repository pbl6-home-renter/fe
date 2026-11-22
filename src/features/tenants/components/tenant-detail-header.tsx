import { useTranslation } from 'react-i18next';
import { Copy, FileText, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { TenantScopeBadge } from './tenant-scope-badge';
import { TenantLinkedBadge } from './tenant-linked-badge';
import type { ContractTenantDetailDto } from '../types/tenant.dto';

export interface TenantDetailHeaderProps {
  tenant: ContractTenantDetailDto;
  phone: string | null;
  onCopyPhone: () => void;
}

export const TenantDetailHeader = ({ tenant, phone, onCopyPhone }: TenantDetailHeaderProps) => {
  const { t } = useTranslation('tenants');
  const displayName = tenant.tenantName || t('detail.unnamedTenant');

  return (
    <Card className="space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5 min-w-0">
          <Avatar
            src={tenant.avatarUrl}
            name={displayName}
            size="lg"
            colorSeed={tenant.contractMemberId}
            className="h-16 w-16 sm:h-20 sm:w-20 text-xl font-bold shrink-0"
          />
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-rentify-text-primary truncate">
                {displayName}
              </h1>
              <TenantScopeBadge scope={tenant.scope} />
              <TenantLinkedBadge isLinked={tenant.isLinked} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-rentify-text-secondary">
              <div className="flex items-center gap-1.5 font-medium">
                <FileText className="h-4 w-4 text-rentify-outline" />
                <span>{t('detail.totalContracts', { count: tenant.contractCount })}</span>
              </div>
              {phone && (
                <>
                  <span>•</span>
                  <span className="font-mono text-rentify-text-primary font-semibold">{phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {phone && (
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyPhone}
              className="gap-1.5 flex-1 sm:flex-initial text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{t('detail.copyPhone')}</span>
            </Button>

            <a href={`tel:${phone}`} className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="gap-1.5 w-full text-xs shadow-xs">
                <Phone className="h-3.5 w-3.5" />
                <span>{t('detail.callAction')}</span>
              </Button>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

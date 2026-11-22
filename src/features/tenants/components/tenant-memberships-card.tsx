import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, DoorOpen, FileText, Phone, CheckCircle2, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContractStatusBadge } from '@/features/contracts/components/contract-status-badge';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/config/routes.config';
import { TenantRoomInfo } from './tenant-room-info';
import type { ContractTenantMembershipDto } from '../types/tenant.dto';

interface TenantMembershipsCardProps {
  memberships: ContractTenantMembershipDto[];
}

export const TenantMembershipsCard = ({ memberships }: TenantMembershipsCardProps) => {
  const { t } = useTranslation('tenants');

  return (
    <Card className="border-rentify-divider shadow-xs bg-rentify-surface">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-rentify-primary" />
          <CardTitle className="text-base font-semibold text-rentify-text-primary">
            {t('detail.historyTitle')}
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-rentify-text-secondary">{t('detail.historyDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        {memberships.length === 0 ? (
          <p className="text-sm text-rentify-text-secondary py-6 text-center">{t('detail.noMemberships')}</p>
        ) : (
          <div className="space-y-3">
            {memberships.map((membership) => {
              const contractLink = ROUTES.LANDLORD.CONTRACT_DETAIL(membership.contractId);
              const isCurrent = membership.isCurrent;

              return (
                <div
                  key={membership.contractMemberId}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    isCurrent
                      ? 'border-rentify-primary/40 bg-rentify-primary-container/20 ring-1 ring-rentify-primary/20 shadow-xs'
                      : 'border-rentify-divider bg-rentify-surface hover:border-rentify-outline/30',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rentify-divider">
                    <div className="flex flex-wrap items-center gap-2">
                      {isCurrent ? (
                        <Badge variant="primary" className="font-semibold text-xs py-0.5 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('detail.currentStayBadge')}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs py-0.5">
                          {t('detail.pastStayBadge')}
                        </Badge>
                      )}

                      <ContractStatusBadge status={membership.contractStatus} />
                    </div>

                    <Link
                      to={contractLink}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-rentify-primary hover:bg-rentify-primary-container/40 transition-colors self-start sm:self-auto"
                    >
                      <span>{t('detail.viewContractAction')}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-rentify-text-secondary">
                    <div className="flex items-center gap-2">
                      <DoorOpen className="h-4 w-4 shrink-0 text-rentify-outline" />
                      <span className="font-medium text-rentify-text-primary">{t('detail.roomLabel')}:</span>
                      <TenantRoomInfo roomId={membership.roomId} />
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-rentify-outline" />
                      <span className="font-medium text-rentify-text-primary">{t('detail.contractCodeLabel')}:</span>
                      <span className="font-mono text-rentify-text-secondary truncate max-w-[200px]">
                        {membership.contractId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-rentify-outline" />
                      <span className="font-medium text-rentify-text-primary">{t('detail.periodLabel')}:</span>
                      <span>
                        {formatDate(membership.joinedAt)} →{' '}
                        {membership.leftAt ? formatDate(membership.leftAt) : t('detail.present')}
                      </span>
                    </div>

                    {membership.tenantPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-rentify-outline" />
                        <span>{t('detail.phoneInContract', { phone: membership.tenantPhone })}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

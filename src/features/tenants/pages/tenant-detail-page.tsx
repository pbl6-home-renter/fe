import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { ROUTES } from '@/config/routes.config';
import { Card } from '@/components/ui/card';
import { BackLink } from '@/components/ui/back-link';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { TenantDetailHeader } from '../components/tenant-detail-header';
import { TenantMembershipsCard } from '../components/tenant-memberships-card';
import { useTenantDetail } from '../hooks/use-tenant-detail';
import { useTenantReportTarget } from '../hooks/use-tenant-report-target';
import { UserReportDialog } from '@/features/moderation/components/user-report-dialog';
import { ReportContextType } from '@/features/moderation/enums/moderation.enum';

export const TenantDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t } = useTranslation('tenants');
  const navigate = useNavigate();

  const { tenant, phone, memberships, isLoading, isError, error, refetch, handleCopyPhone } = useTenantDetail(id);
  const reportTarget = useTenantReportTarget(tenant, memberships);
  const [reportOpen, setReportOpen] = useState(false);

  const errorStatus = isAxiosError(error) ? error.response?.status : undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !tenant) {
    if (errorStatus === 404 || !tenant) {
      return (
        <div className="space-y-6">
          <BackLink to={ROUTES.LANDLORD.TENANTS}>{t('detail.back')}</BackLink>
          <Card className="my-8 p-8 border-rentify-divider rounded-2xl shadow-xs">
            <ErrorState
              title={t('detail.notFoundTitle')}
              message={t('detail.notFoundDesc')}
              retryText={t('detail.back')}
              onRetry={() => navigate(ROUTES.LANDLORD.TENANTS)}
            />
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <BackLink to={ROUTES.LANDLORD.TENANTS}>{t('detail.back')}</BackLink>
        <Card className="my-8 p-8 border-rentify-divider rounded-2xl shadow-xs">
          <ErrorState onRetry={() => void refetch()} />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink to={ROUTES.LANDLORD.TENANTS}>{t('detail.back')}</BackLink>

      <TenantDetailHeader
        tenant={tenant}
        phone={phone}
        onCopyPhone={handleCopyPhone}
        onReport={reportTarget ? () => setReportOpen(true) : undefined}
      />

      <TenantMembershipsCard memberships={memberships} />

      {reportTarget && (
        <UserReportDialog
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          reportedUser={{ id: reportTarget.userId, name: tenant.tenantName || t('detail.unnamedTenant') }}
          context={{ type: ReportContextType.CONTRACT, id: reportTarget.contractId }}
        />
      )}
    </div>
  );
};

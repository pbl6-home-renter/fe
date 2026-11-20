import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes.config';
import { formatDate, formatVnd } from '@/lib/utils/format';
import { ContractStatusBadge } from '../../components/contract-status-badge';
import { useContractQuery } from '../../hooks/use-contract-query';
import { useContractChat } from '../../hooks/use-contract-chat';

export const TenantContractDetailPage = () => {
  const { t } = useTranslation('contracts');
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useContractQuery(id);
  const { openContractChat, isChatLoading } = useContractChat(data);
  return (
    <div className="space-y-6">
      <BackLink to={ROUTES.TENANT.CONTRACTS}>{t('tenant.back')}</BackLink>
      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : isError || !data ? (
        <ErrorState title={t('tenant.detailUnavailable')} onRetry={() => void refetch()} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary">
                {t('tenant.detailTitle')}
              </h1>
              <ContractStatusBadge status={data.status} />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openContractChat}
              isLoading={isChatLoading}
              className="gap-1.5 text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/5"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t('actions.contractChat')}</span>
            </Button>
          </div>
          <Card className="max-w-2xl space-y-4 text-sm">
            <p>{t('tenant.dates', { start: formatDate(data.startDate), end: formatDate(data.endDate) })}</p>
            <p>{t('tenant.rentValue', { value: formatVnd(data.rentPrice) })}</p>
            <p>{t('tenant.depositValue', { value: formatVnd(data.depositAmount) })}</p>
            {data.tenantName && <p>{t('tenant.tenantValue', { value: data.tenantName })}</p>}
            {data.tenantPhone && <p>{t('tenant.phoneValue', { value: data.tenantPhone })}</p>}
            {data.description && <p>{t('tenant.descriptionValue', { value: data.description })}</p>}
          </Card>
        </>
      )}
    </div>
  );
};

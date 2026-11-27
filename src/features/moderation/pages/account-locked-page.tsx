import { useTranslation } from 'react-i18next';
import { Clock, Lock, LogOut, XCircle } from 'lucide-react';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { formatDate, formatDateTime } from '@/lib/utils/format';
import { AppealStatus } from '../enums/moderation.enum';
import { AppealForm } from '../components/appeal-form';
import { useAccountLockedPage } from '../hooks/use-account-locked-page';

export const AccountLockedPage = () => {
  const { t } = useTranslation('moderation');
  const { lockReason, lockedAt, appealQuery, onLogout, isLoggingOut } = useAccountLockedPage();
  const current = appealQuery.data;
  const appeal = current?.appeal ?? null;

  const renderAppealSection = () => {
    if (appealQuery.isLoading) {
      return <Skeleton className="h-48 w-full rounded-2xl" />;
    }
    if (appealQuery.isError || !current) {
      return (
        <ErrorState
          title={t('locked.appealErrorTitle')}
          message={t('locked.appealErrorDescription')}
          retryText={t('actions.retry')}
          onRetry={() => void appealQuery.refetch()}
        />
      );
    }

    return (
      <div className="space-y-4">
        {appeal?.status === AppealStatus.PENDING && (
          <AlertBanner variant="info" title={t('locked.pendingTitle')}>
            <p>{t('locked.pendingDescription')}</p>
            <p className="mt-1 text-xs">{t('locked.sentAt', { date: formatDateTime(appeal.createdAt) })}</p>
          </AlertBanner>
        )}

        {appeal?.status === AppealStatus.REJECTED && (
          <AlertBanner variant="error" title={t('locked.rejectedTitle')}>
            <p>{t('locked.rejectReason', { reason: appeal.rejectReason ?? t('locked.noReason') })}</p>
            {!current.canSubmit && current.nextSubmitAt && (
              <p className="mt-1 font-medium">{t('locked.nextSubmitAt', { date: formatDate(current.nextSubmitAt) })}</p>
            )}
          </AlertBanner>
        )}

        {current.canSubmit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t('appealForm.title')}</CardTitle>
              <p className="text-sm text-rentify-text-secondary">{t('appealForm.subtitle')}</p>
            </CardHeader>
            <CardContent>
              <AppealForm lockReason={lockReason} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-rentify-background px-4 py-8 text-rentify-text-primary sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <RentifyLogo size="sm" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => void onLogout()}
            isLoading={isLoggingOut}
            className="gap-1.5"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>{t('locked.logout')}</span>
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rentify-error/10 text-rentify-error">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 space-y-1">
                <h1 className="text-xl font-bold tracking-tight">{t('locked.title')}</h1>
                <p className="text-sm text-rentify-text-secondary">{t('locked.subtitle')}</p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('locked.reasonLabel')}</span>
                </dt>
                <dd className="whitespace-pre-line text-sm font-medium">{lockReason ?? t('locked.noReason')}</dd>
              </div>
              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('locked.lockedAtLabel')}</span>
                </dt>
                <dd className="text-sm font-medium tabular-nums">{lockedAt ? formatDateTime(lockedAt) : '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {renderAppealSection()}
      </div>
    </div>
  );
};

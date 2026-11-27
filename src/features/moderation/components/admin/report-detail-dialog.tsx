import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock, XCircle } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/utils/format';
import { ReportResolveAction, ReportStatus } from '../../enums/moderation.enum';
import { useReportDetailQuery } from '../../hooks/use-report-detail-query';
import { useResolveReportMutation } from '../../hooks/use-resolve-report-mutation';
import { ModerationMediaGallery } from '../moderation-media-gallery';
import { ReportStatusBadge } from '../moderation-status-badge';
import { ModerationReasonDialog } from './moderation-reason-dialog';
import { ModerationUserCell } from './moderation-user-cell';

const DetailItem = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <dt className="text-xs text-rentify-text-secondary">{label}</dt>
    <dd className="text-sm text-rentify-text-primary">{children}</dd>
  </div>
);

type ResolveStep = 'dismiss' | 'close' | 'lock';

export interface ReportDetailDialogProps {
  reportId: string | null;
  onClose: () => void;
}

export const ReportDetailDialog = ({ reportId, onClose }: ReportDetailDialogProps) => {
  const { t } = useTranslation('moderation');
  const open = Boolean(reportId);
  const query = useReportDetailQuery(reportId ?? '', { enabled: open });
  const mutation = useResolveReportMutation();
  const [step, setStep] = useState<ResolveStep | null>(null);
  const report = query.data;
  const isPending = report?.status === ReportStatus.PENDING;
  // Already locked (e.g. by another report): only close the report, nothing to lock.
  const isReportedUserLocked = report?.reportedUser.status === 'locked';

  const closeAll = () => {
    setStep(null);
    onClose();
  };

  const handleResolve = (reason: string) => {
    if (!reportId || !step) return;
    const payload =
      step === 'lock'
        ? { action: ReportResolveAction.LOCK, lockReason: reason }
        : { action: ReportResolveAction.DISMISS, ...(reason ? { note: reason } : {}) };
    mutation.mutate({ reportId, payload }, { onSuccess: closeAll });
  };

  const stepConfig = {
    dismiss: {
      title: t('reports.dismiss.title'),
      description: t('reports.dismiss.description'),
      label: t('reports.dismiss.noteLabel'),
      confirmText: t('reports.actions.dismiss'),
    },
    close: {
      title: t('reports.close.title'),
      description: t('reports.close.description'),
      label: t('reports.dismiss.noteLabel'),
      confirmText: t('reports.actions.close'),
    },
    lock: {
      title: t('reports.lock.title'),
      description: t('reports.lock.description', { name: report?.reportedUser.name ?? t('user.unknown') }),
      label: t('reports.lock.reasonLabel'),
      confirmText: t('reports.actions.lock'),
    },
  } as const;
  const activeStep = step ? stepConfig[step] : null;

  return (
    <>
      <Dialog
        open={open && step === null}
        onClose={onClose}
        title={t('reports.detail.title')}
        description={report ? t('reports.detail.sentAt', { date: formatDateTime(report.createdAt) }) : undefined}
        maxWidth="lg"
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('actions.close')}
            </Button>
            {isPending && isReportedUserLocked && (
              <Button className="gap-1.5" onClick={() => setStep('close')}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>{t('reports.actions.close')}</span>
              </Button>
            )}
            {isPending && !isReportedUserLocked && (
              <>
                <Button variant="secondary" className="gap-1.5" onClick={() => setStep('dismiss')}>
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{t('reports.actions.dismiss')}</span>
                </Button>
                <Button variant="danger" className="gap-1.5" onClick={() => setStep('lock')}>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>{t('reports.actions.lock')}</span>
                </Button>
              </>
            )}
          </div>
        }
      >
        {query.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : query.isError || !report ? (
          <ErrorState
            title={t('detail.errorTitle')}
            message={t('detail.errorDescription')}
            retryText={t('actions.retry')}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4 sm:grid-cols-2">
              <DetailItem label={t('reports.columns.reportedUser')}>
                <ModerationUserCell user={report.reportedUser} withLink withStatus onNavigate={onClose} />
              </DetailItem>
              <DetailItem label={t('reports.columns.reporter')}>
                <ModerationUserCell user={report.reporter} withLink onNavigate={onClose} />
              </DetailItem>
              <DetailItem label={t('reports.columns.category')}>
                <Badge variant="secondary">{t(`categories.${report.category}.label`)}</Badge>
              </DetailItem>
              <DetailItem label={t('reports.columns.status')}>
                <ReportStatusBadge status={report.status} />
              </DetailItem>
              {report.contextType && report.contextId && (
                <div className="sm:col-span-2">
                  <DetailItem label={t('reports.detail.context')}>
                    {t(`reports.contextTypes.${report.contextType}`)}{' '}
                    <span className="text-xs tabular-nums text-rentify-text-secondary">
                      ({report.contextId.slice(0, 8)})
                    </span>
                  </DetailItem>
                </div>
              )}
            </dl>

            <section className="space-y-2 rounded-xl border border-rentify-divider p-4">
              <h3 className="text-sm font-semibold">{t('report.descriptionLabel')}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed">{report.description}</p>
            </section>

            <section className="space-y-2 rounded-xl border border-rentify-divider p-4">
              <h3 className="text-sm font-semibold">{t('report.evidenceLabel')}</h3>
              <ModerationMediaGallery mediaIds={report.evidenceMediaIds} />
            </section>

            {report.status !== ReportStatus.PENDING && (
              <dl className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider p-4 sm:grid-cols-2">
                <DetailItem label={t('detail.reviewedBy')}>{report.resolvedBy?.name ?? '—'}</DetailItem>
                <DetailItem label={t('detail.reviewedAt')}>
                  <span className="tabular-nums">{formatDateTime(report.resolvedAt)}</span>
                </DetailItem>
                {report.resolutionNote && (
                  <div className="sm:col-span-2">
                    <DetailItem label={t('reports.detail.resolutionNote')}>{report.resolutionNote}</DetailItem>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}
      </Dialog>

      {activeStep && (
        <ModerationReasonDialog
          open={open && step !== null}
          onClose={() => setStep(null)}
          title={activeStep.title}
          description={activeStep.description}
          label={activeStep.label}
          confirmText={activeStep.confirmText}
          confirmVariant={step === 'lock' ? 'danger' : 'primary'}
          required={step === 'lock'}
          defaultValue={step === 'lock' && report ? t(`categories.${report.category}.lockReason`) : ''}
          isSubmitting={mutation.isPending}
          onSubmit={handleResolve}
        />
      )}
    </>
  );
};

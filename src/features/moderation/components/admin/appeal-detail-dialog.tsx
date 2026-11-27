import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/utils/format';
import { AppealStatus } from '../../enums/moderation.enum';
import { useAppealDetailQuery } from '../../hooks/use-appeal-detail-query';
import { useReviewAppealMutation } from '../../hooks/use-review-appeal-mutation';
import { ModerationMediaGallery } from '../moderation-media-gallery';
import { AppealStatusBadge } from '../moderation-status-badge';
import { ModerationReasonDialog } from './moderation-reason-dialog';
import { ModerationUserCell } from './moderation-user-cell';

const DetailItem = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <dt className="text-xs text-rentify-text-secondary">{label}</dt>
    <dd className="text-sm text-rentify-text-primary">{children}</dd>
  </div>
);

export interface AppealDetailDialogProps {
  appealId: string | null;
  onClose: () => void;
}

export const AppealDetailDialog = ({ appealId, onClose }: AppealDetailDialogProps) => {
  const { t } = useTranslation('moderation');
  const open = Boolean(appealId);
  const query = useAppealDetailQuery(appealId ?? '', { enabled: open });
  const mutation = useReviewAppealMutation();
  const [confirm, setConfirm] = useState<'accept' | 'reject' | null>(null);
  const appeal = query.data;
  const isPending = appeal?.status === AppealStatus.PENDING;

  const closeAll = () => {
    setConfirm(null);
    onClose();
  };

  const handleAccept = () => {
    if (!appealId) return;
    mutation.mutate({ appealId, decision: 'accept' }, { onSuccess: closeAll });
  };

  const handleReject = (rejectReason: string) => {
    if (!appealId) return;
    mutation.mutate({ appealId, decision: 'reject', rejectReason }, { onSuccess: closeAll });
  };

  return (
    <>
      <Dialog
        open={open && confirm === null}
        onClose={onClose}
        title={t('appeals.detail.title')}
        description={appeal ? t('appeals.detail.sentAt', { date: formatDateTime(appeal.createdAt) }) : undefined}
        maxWidth="lg"
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('actions.close')}
            </Button>
            {isPending && (
              <>
                <Button variant="danger" className="gap-1.5" onClick={() => setConfirm('reject')}>
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span>{t('appeals.actions.reject')}</span>
                </Button>
                <Button className="gap-1.5" onClick={() => setConfirm('accept')}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>{t('appeals.actions.accept')}</span>
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
        ) : query.isError || !appeal ? (
          <ErrorState
            title={t('detail.errorTitle')}
            message={t('detail.errorDescription')}
            retryText={t('actions.retry')}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4 sm:grid-cols-2">
              <DetailItem label={t('appeals.columns.user')}>
                <ModerationUserCell user={appeal.user} withLink withStatus onNavigate={onClose} />
              </DetailItem>
              <DetailItem label={t('appeals.columns.status')}>
                <AppealStatusBadge status={appeal.status} />
              </DetailItem>
              <DetailItem label={t('appeals.columns.lockReason')}>
                {appeal.lockReason ?? t('locked.noReason')}
              </DetailItem>
              <DetailItem label={t('locked.lockedAtLabel')}>
                <span className="tabular-nums">{formatDateTime(appeal.lockedAt)}</span>
              </DetailItem>
              <DetailItem label={t('appealForm.contactEmailLabel')}>{appeal.contactEmail ?? '—'}</DetailItem>
              <DetailItem label={t('appealForm.contactPhoneLabel')}>
                <span className="tabular-nums">{appeal.contactPhone ?? '—'}</span>
              </DetailItem>
            </dl>

            <section className="space-y-2 rounded-xl border border-rentify-divider p-4">
              <h3 className="text-sm font-semibold">{t('appeals.detail.content')}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed">{appeal.content}</p>
            </section>

            <section className="space-y-2 rounded-xl border border-rentify-divider p-4">
              <h3 className="text-sm font-semibold">{t('appealForm.attachmentsLabel')}</h3>
              <ModerationMediaGallery mediaIds={appeal.attachmentMediaIds} />
            </section>

            {appeal.status !== AppealStatus.PENDING && (
              <dl className="grid grid-cols-1 gap-3 rounded-xl border border-rentify-divider p-4 sm:grid-cols-2">
                <DetailItem label={t('detail.reviewedBy')}>{appeal.reviewedBy?.name ?? '—'}</DetailItem>
                <DetailItem label={t('detail.reviewedAt')}>
                  <span className="tabular-nums">{formatDateTime(appeal.reviewedAt)}</span>
                </DetailItem>
                {appeal.rejectReason && (
                  <div className="sm:col-span-2">
                    <DetailItem label={t('appeals.detail.rejectReason')}>{appeal.rejectReason}</DetailItem>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}
      </Dialog>

      <Dialog
        open={open && confirm === 'accept'}
        onClose={() => setConfirm(null)}
        title={t('appeals.accept.title')}
        description={t('appeals.accept.description', { name: appeal?.user.name ?? t('user.unknown') })}
        maxWidth="md"
        closeOnEsc={!mutation.isPending}
        closeOnOutsideClick={!mutation.isPending}
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirm(null)} disabled={mutation.isPending}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleAccept} isLoading={mutation.isPending}>
              {t('appeals.accept.confirm')}
            </Button>
          </div>
        }
      >
        <p className="py-2 text-sm text-rentify-text-secondary">{t('appeals.accept.message')}</p>
      </Dialog>

      <ModerationReasonDialog
        open={open && confirm === 'reject'}
        onClose={() => setConfirm(null)}
        title={t('appeals.reject.title')}
        description={t('appeals.reject.description')}
        label={t('appeals.reject.reasonLabel')}
        placeholder={t('appeals.reject.reasonPlaceholder')}
        confirmText={t('appeals.reject.confirm')}
        confirmVariant="danger"
        required
        isSubmitting={mutation.isPending}
        onSubmit={handleReject}
      />
    </>
  );
};

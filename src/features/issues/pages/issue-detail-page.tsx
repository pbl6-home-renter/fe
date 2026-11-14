import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { IssueEditDialog } from '../components/issue-edit-dialog';
import { IssuePhoto } from '../components/issue-photo';
import { useIssueDetailPage } from '../hooks/use-issue-detail-page';

export const IssueDetailPage = () => {
  const { t, i18n } = useTranslation('issues');
  const state = useIssueDetailPage();
  if (state.query.isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;
  if (!state.query.data)
    return (
      <ErrorState title={t('loadError')} retryText={t('retry')} onRetry={() => void state.query.refetch()}>
        <Button variant="outline" onClick={state.goBack}>
          {t('back')}
        </Button>
      </ErrorState>
    );
  const issue = state.query.data;
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={state.goBack}>
        {t('back')}
      </Button>
      <PageHeader
        title={issue.title}
        description={`${issue.buildingName} · ${issue.roomName}`}
        actions={
          <>
            {issue.canUpdate && (
              <Button variant="outline" onClick={() => state.setEditOpen(true)}>
                {t('edit')}
              </Button>
            )}
            {issue.canUpdate && issue.status === 'open' && (
              <Button isLoading={state.isUpdating} onClick={() => state.advance('in_progress')}>
                {t('start')}
              </Button>
            )}
            {issue.canUpdate && issue.status === 'in_progress' && (
              <Button isLoading={state.isUpdating} onClick={() => state.advance('resolved')}>
                {t('resolve')}
              </Button>
            )}
            {issue.canCancel && (
              <Button variant="danger" onClick={() => state.setCancelOpen(true)}>
                {t('cancelIssue')}
              </Button>
            )}
          </>
        }
      />
      <Card className="space-y-3">
        <p>
          <strong>{t('statusLabel')}:</strong> {t(`statuses.${issue.status}`)}
        </p>
        <p>
          <strong>{t('category')}:</strong> {t(`categories.${issue.category}`)}
        </p>
        <p>
          <strong>{t('urgency')}:</strong> {t(`urgencies.${issue.urgency}`)}
        </p>
        <p>
          <strong>{t('createdAt')}:</strong>{' '}
          {new Intl.DateTimeFormat(i18n.language.startsWith('en') ? 'en-US' : 'vi-VN', { dateStyle: 'medium' }).format(
            new Date(issue.createdAt),
          )}
        </p>
        {issue.description && <p className="whitespace-pre-wrap">{issue.description}</p>}
        {issue.assignedTo && (
          <p>
            <strong>{t('assignedTo')}:</strong> {issue.assignedTo}
          </p>
        )}
        {issue.repairCost !== null && (
          <p>
            <strong>{t('repairCost')}:</strong> {new Intl.NumberFormat(i18n.language).format(issue.repairCost)}
          </p>
        )}
        {issue.resolutionNote && (
          <p className="whitespace-pre-wrap">
            <strong>{t('resolutionNote')}:</strong> {issue.resolutionNote}
          </p>
        )}
      </Card>
      <Card className="space-y-4">
        <h2 className="font-semibold">{t('photos')}</h2>
        {issue.issuePhotoMediaIds.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {issue.issuePhotoMediaIds.map((id) => (
              <IssuePhoto key={id} id={id} />
            ))}
          </div>
        ) : (
          <p>{t('noPhotos')}</p>
        )}
        {issue.canUploadPhotos && (
          <Input
            type="file"
            label={t('addPhoto')}
            accept={getMediaAccept(MediaPurpose.ISSUE_PHOTO)}
            disabled={state.upload.isUploading}
            onChange={state.uploadFile}
          />
        )}
        {state.upload.isUploading && (
          <div>
            <p>{t('uploading', { progress: state.upload.progress })}</p>
            <Button variant="outline" onClick={state.upload.cancel}>
              {t('cancelUpload')}
            </Button>
          </div>
        )}
      </Card>
      {state.editOpen && <IssueEditDialog issue={issue} onClose={() => state.setEditOpen(false)} />}
      <Dialog
        open={state.cancelOpen}
        title={t('confirmCancel')}
        onClose={() => state.setCancelOpen(false)}
        closeOnEsc={!state.isCancelling}
        closeOnOutsideClick={!state.isCancelling}
        footer={
          <>
            <Button variant="outline" onClick={() => state.setCancelOpen(false)} disabled={state.isCancelling}>
              {t('cancel')}
            </Button>
            <Button variant="danger" onClick={state.confirmCancel} isLoading={state.isCancelling}>
              {t('confirm')}
            </Button>
          </>
        }
      />
    </div>
  );
};

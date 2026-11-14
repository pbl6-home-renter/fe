import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { CardButton } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { IssueCreateDialog } from '../components/issue-create-dialog';
import { useIssueListPage } from '../hooks/use-issue-list-page';
import type { IssueStatus } from '../types/issue.dto';

export const IssueListPage = () => {
  const { t } = useTranslation('issues');
  const page = useIssueListPage();
  const statuses = ['open', 'in_progress', 'resolved', 'cancelled'] as const;
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={<Button onClick={() => page.setCreateOpen(true)}>{t('create')}</Button>}
      />
      <div className="max-w-xs">
        <SelectDropdown
          label={t('statusLabel')}
          value={page.status}
          options={[
            { value: '', label: t('allStatuses') },
            ...statuses.map((value) => ({ value, label: t(`statuses.${value}`) })),
          ]}
          onSelectOption={(option) => page.setStatus(option.value as IssueStatus | '')}
        />
      </div>
      {page.query.isLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : page.query.isError || !page.query.data ? (
        <ErrorState title={t('loadError')} retryText={t('retry')} onRetry={() => void page.query.refetch()} />
      ) : page.query.data.items.length === 0 ? (
        <EmptyState title={t('empty')} description={t('emptyDescription')} />
      ) : (
        <div className="space-y-3">
          {page.query.data.items.map((issue) => (
            <CardButton key={issue.id} onClick={() => page.openIssue(issue.id)}>
              <span className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-semibold">{issue.title}</span>
                <span className="text-sm text-rentify-text-secondary">{t(`statuses.${issue.status}`)}</span>
              </span>
              <span className="mt-1 block text-sm text-rentify-text-secondary">
                {issue.buildingName} · {issue.roomName}
              </span>
            </CardButton>
          ))}
        </div>
      )}
      {page.query.data && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={!page.query.data.pagination.hasPreviousPage}
            onClick={() => page.setPageNo(page.pageNo - 1)}
          >
            {t('previous')}
          </Button>
          <span className="text-sm">
            {t('page', { page: page.pageNo, total: Math.max(1, page.query.data.pagination.totalPages) })}
          </span>
          <Button
            variant="outline"
            disabled={!page.query.data.pagination.hasNextPage}
            onClick={() => page.setPageNo(page.pageNo + 1)}
          >
            {t('next')}
          </Button>
        </div>
      )}
      {page.createOpen && (
        <IssueCreateDialog tenant={page.tenant} onClose={() => page.setCreateOpen(false)} onCreated={page.onCreated} />
      )}
    </div>
  );
};

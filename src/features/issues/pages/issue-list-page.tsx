import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { IssueCreateDialog } from '../components/issue-create-dialog';
import { IssueListTable } from '../components/issue-list-table';
import { useIssueListPage } from '../hooks/use-issue-list-page';

export const IssueListPage = () => {
  const { t } = useTranslation('issues');
  const page = useIssueListPage();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={<Button onClick={() => page.setCreateOpen(true)}>{t('create')}</Button>}
      />
      <IssueListTable
        issues={page.query.data?.items ?? []}
        rowCount={page.query.data?.pagination.totalItems ?? 0}
        state={page.tableState.state}
        handlers={page.tableState.handlers}
        density={page.tableState.state.density}
        onDensityChange={page.tableState.setDensity}
        status={page.status}
        onStatusChange={page.setStatus}
        onClearFilters={page.clearFilters}
        onOpenIssue={page.openIssue}
        isLoading={page.query.isLoading}
        isFetching={page.query.isFetching}
        isError={page.query.isError}
        onRetry={() => void page.query.refetch()}
      />
      {page.createOpen && (
        <IssueCreateDialog tenant={page.tenant} onClose={() => page.setCreateOpen(false)} onCreated={page.onCreated} />
      )}
    </div>
  );
};

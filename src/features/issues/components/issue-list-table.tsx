import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { useDataTable } from '@/hooks/use-data-table';
import { ISSUE_STATUSES } from '../constants/issue.constants';
import { useIssueListColumns } from '../hooks/use-issue-list-columns';
import type { IssueListItem, IssueStatus } from '../types/issue.dto';

export interface IssueListTableProps {
  issues: IssueListItem[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  status: IssueStatus | '';
  onStatusChange: (status: IssueStatus | '') => void;
  onClearFilters: () => void;
  onOpenIssue: (id: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const IssueListTable = (props: IssueListTableProps) => {
  const { t } = useTranslation('issues');
  const columns = useIssueListColumns();

  const table = useDataTable({
    data: props.issues,
    columns,
    getRowId: (issue) => issue.id,
    rowCount: props.rowCount,
    mode: 'server',
    state: props.state,
    handlers: props.handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });

  return (
    <DataTable
      table={table}
      tableId="issues"
      caption={t('title')}
      density={props.density}
      onDensityChange={props.onDensityChange}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.isError}
      onRetry={props.onRetry}
      isFiltered={Boolean(props.status)}
      emptyState={{ title: t('empty'), description: t('emptyDescription') }}
      filteredEmptyState={{
        title: t('empty'),
        description: t('filteredEmptyDescription'),
        actionText: t('clearFilter'),
        onAction: props.onClearFilters,
      }}
      toolbar={
        <DataTableToolbar
          filters={
            <SelectDropdown
              searchable={false}
              value={props.status}
              options={[
                { value: '', label: t('allStatuses') },
                ...ISSUE_STATUSES.map((value) => ({ value, label: t(`statuses.${value}`) })),
              ]}
              onSelectOption={(option) => props.onStatusChange(option.value as IssueStatus | '')}
              containerClassName="w-full sm:w-52"
            />
          }
        />
      }
      onRowClick={(issue) => props.onOpenIssue(issue.id)}
      renderMobileRow={(row) => (
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-rentify-text-primary">{row.original.title}</p>
            <span className="shrink-0 text-xs font-medium text-rentify-text-secondary">
              {t(`statuses.${row.original.status}`)}
            </span>
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {row.original.buildingName} · {row.original.roomName}
          </p>
        </div>
      )}
    />
  );
};

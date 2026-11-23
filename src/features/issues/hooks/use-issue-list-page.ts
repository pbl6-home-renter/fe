import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ROUTES } from '@/config/routes.config';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { Role } from '@/types/role';
import {
  DEFAULT_ISSUE_COLUMN_PINNING,
  DEFAULT_ISSUE_FILTERS,
  ISSUE_COLUMN_IDS,
  ISSUE_STATUSES,
  REQUIRED_ISSUE_COLUMN_IDS,
} from '../constants/issue.constants';
import type { IssueStatus } from '../types/issue.dto';
import { useIssuesQuery } from './use-issues-query';

export const useIssueListPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const tenant = role === Role.TENANT;
  const [createOpen, setCreateOpen] = useState(false);
  const tableState = useDataTableState({
    tableId: 'issues',
    columnIds: ISSUE_COLUMN_IDS,
    allowedSorts: [],
    defaultFilters: DEFAULT_ISSUE_FILTERS,
    defaultColumnPinning: DEFAULT_ISSUE_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_ISSUE_COLUMN_IDS,
  });
  const status: IssueStatus | '' = ISSUE_STATUSES.find((value) => value === tableState.filters.status) ?? '';
  const query = useIssuesQuery(
    tenant,
    { pageNo: tableState.pageNo, pageSize: tableState.pageSize, filter: status ? { status } : {} },
    { enabled: role === Role.TENANT || role === Role.LANDLORD },
  );
  return {
    tenant,
    query,
    tableState,
    status,
    createOpen,
    setCreateOpen,
    setStatus: (value: IssueStatus | '') => tableState.setFilter('status', value),
    clearFilters: tableState.clearFilters,
    openIssue: (id: string) => navigate(ROUTES.ISSUE_DETAIL(id)),
    onCreated: (id: string) => {
      setCreateOpen(false);
      navigate(ROUTES.ISSUE_DETAIL(id));
    },
  };
};

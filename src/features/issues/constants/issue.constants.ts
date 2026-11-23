import type { ColumnPinningState } from '@tanstack/react-table';
import type { IssueListParams, IssueStatus } from '../types/issue.dto';

export const ISSUE_QUERY_KEYS = {
  ALL: ['issues'] as const,
  LIST: (role: string, params?: IssueListParams) => ['issues', 'list', role, params] as const,
  DETAIL: (id: string) => ['issues', 'detail', id] as const,
};

export const ISSUE_COLUMN_IDS = ['title', 'room', 'category', 'urgency', 'status', 'createdAt'];

export const REQUIRED_ISSUE_COLUMN_IDS = ['title'];

export const DEFAULT_ISSUE_COLUMN_PINNING: ColumnPinningState = { left: ['title'], right: [] };

export const DEFAULT_ISSUE_FILTERS = { status: '' };

export const ISSUE_STATUSES: IssueStatus[] = ['open', 'in_progress', 'resolved', 'cancelled'];

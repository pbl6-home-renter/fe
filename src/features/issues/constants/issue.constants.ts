import type { IssueListParams } from '../types/issue.dto';

export const ISSUE_QUERY_KEYS = {
  ALL: ['issues'] as const,
  LIST: (role: string, params?: IssueListParams) => ['issues', 'list', role, params] as const,
  DETAIL: (id: string) => ['issues', 'detail', id] as const,
};

import type { ColumnPinningState } from '@tanstack/react-table';
import type { AppealListParams, ReportListParams } from '../types/moderation.dto';

export const MODERATION_QUERY_KEYS = {
  ALL: ['moderation'] as const,
  MY_APPEAL: ['moderation', 'my-appeal'] as const,
  APPEALS: ['moderation', 'appeals'] as const,
  APPEAL_LIST: (params?: AppealListParams) => [...MODERATION_QUERY_KEYS.APPEALS, 'list', params] as const,
  APPEAL_DETAIL: (appealId: string) => [...MODERATION_QUERY_KEYS.APPEALS, 'detail', appealId] as const,
  REPORTS: ['moderation', 'reports'] as const,
  REPORT_LIST: (params?: ReportListParams) => [...MODERATION_QUERY_KEYS.REPORTS, 'list', params] as const,
  REPORT_DETAIL: (reportId: string) => [...MODERATION_QUERY_KEYS.REPORTS, 'detail', reportId] as const,
};

/** Limits from `requests/moderation/*` in api-docs. */
export const MODERATION_LIMITS = {
  MAX_FILES: 3,
  APPEAL_CONTENT_MIN: 10,
  APPEAL_CONTENT_MAX: 2000,
  REPORT_DESCRIPTION_MIN: 10,
  REPORT_DESCRIPTION_MAX: 1000,
  REASON_MAX: 500,
} as const;

export const CONTACT_PHONE_REGEX = /^\+?\d{8,15}$/;

export const DEFAULT_MODERATION_PAGE_SIZE = 20;

// Sorting is fixed by the backend (pending oldest first), no sort param is accepted.
export const ALLOWED_MODERATION_SORTS: string[] = [];

export const DEFAULT_MODERATION_COLUMN_PINNING: ColumnPinningState = {
  left: [],
  right: ['actions'],
};

export const APPEAL_COLUMN_IDS = ['user', 'lockReason', 'createdAt', 'status', 'actions'];
export const REQUIRED_APPEAL_COLUMN_IDS = ['user', 'actions'];

export const REPORT_COLUMN_IDS = ['reportedUser', 'category', 'reporter', 'createdAt', 'status', 'actions'];
export const REQUIRED_REPORT_COLUMN_IDS = ['reportedUser', 'actions'];

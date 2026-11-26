import type { ColumnPinningState } from '@tanstack/react-table';
import type { AuditLogListParams } from '../types/audit-logs.dto';

export const AUDIT_LOGS_QUERY_KEYS = {
  ALL: ['audit-logs'] as const,
  LIST: (params?: AuditLogListParams) => [...AUDIT_LOGS_QUERY_KEYS.ALL, 'list', params] as const,
  DETAIL: (auditLogId: string) => [...AUDIT_LOGS_QUERY_KEYS.ALL, 'detail', auditLogId] as const,
};

export const AUDIT_LOG_COLUMN_IDS = ['createdAt', 'actorName', 'action', 'entity', 'actions'];

export const REQUIRED_AUDIT_LOG_COLUMN_IDS = ['createdAt', 'action', 'actions'];

export const DEFAULT_AUDIT_LOG_COLUMN_PINNING: ColumnPinningState = {
  left: [],
  right: ['actions'],
};

// Sorting is fixed by the backend (created_at DESC, id DESC) and no sort param is accepted.
export const ALLOWED_AUDIT_LOG_SORTS: string[] = [];

export const DEFAULT_AUDIT_LOG_PAGE_SIZE = 20;

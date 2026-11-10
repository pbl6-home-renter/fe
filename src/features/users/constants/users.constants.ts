import type { ColumnPinningState } from '@tanstack/react-table';
import type { UserListAdminParams, UserSortField } from '../types/users.dto';

export const USERS_QUERY_KEYS = {
  ALL: ['users'] as const,
  ME: (userId?: string | null) => [...USERS_QUERY_KEYS.ALL, 'me', userId ?? 'anonymous'] as const,
  LIST: (params?: UserListAdminParams) => [...USERS_QUERY_KEYS.ALL, 'list', params] as const,
  DETAIL: (id: string) => [...USERS_QUERY_KEYS.ALL, 'detail', id] as const,
};

export const ALLOWED_USER_SORTS: readonly UserSortField[] = ['createdAt', 'name', 'email'];
export const DEFAULT_USER_SORT = { id: 'createdAt', desc: true };

export const USER_COLUMN_IDS = ['name', 'email', 'phone', 'role', 'status', 'actions'];
export const REQUIRED_USER_COLUMN_IDS = ['name', 'actions'];
export const DEFAULT_USER_COLUMN_PINNING: ColumnPinningState = {
  left: ['name'],
  right: ['actions'],
};

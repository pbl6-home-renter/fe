import { useMemo } from 'react';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useDebounce } from '@/hooks/use-debounce';
import { isValidRole, type Role } from '@/types/role';
import { isValidUserStatus, type UserStatus } from '@/types/user';
import {
  ALLOWED_USER_SORTS,
  DEFAULT_USER_COLUMN_PINNING,
  DEFAULT_USER_SORT,
  REQUIRED_USER_COLUMN_IDS,
  USER_COLUMN_IDS,
} from '../constants/users.constants';
import type { UserListAdminParams, UserSortField } from '../types/users.dto';
import { useUsersAdminQuery } from './use-users-admin-query';

const DEFAULT_FILTERS = { role: 'all', status: 'all' };

export const useUserList = () => {
  const tableState = useDataTableState({
    tableId: 'admin-users',
    columnIds: USER_COLUMN_IDS,
    allowedSorts: ALLOWED_USER_SORTS as unknown as string[],
    defaultSort: DEFAULT_USER_SORT,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_USER_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_USER_COLUMN_IDS,
  });

  const debouncedSearch = useDebounce(tableState.search.trim());

  const selectedRole = isValidRole(tableState.filters.role) ? (tableState.filters.role as Role) : undefined;

  const selectedStatus = isValidUserStatus(tableState.filters.status)
    ? (tableState.filters.status as UserStatus)
    : undefined;

  const sorting = tableState.state.sorting[0];
  const sort = (sorting?.id as UserSortField) ?? 'createdAt';
  const order = sorting ? (sorting.desc ? 'desc' : 'asc') : 'desc';

  const queryParams = useMemo<UserListAdminParams>(
    () => ({
      pageNo: tableState.pageNo,
      pageSize: tableState.pageSize,
      sort,
      order,
      role: selectedRole,
      status: selectedStatus,
      q: debouncedSearch || undefined,
    }),
    [tableState.pageNo, tableState.pageSize, sort, order, selectedRole, selectedStatus, debouncedSearch],
  );

  const query = useUsersAdminQuery(queryParams);

  const isFiltered = Boolean(debouncedSearch || selectedRole || selectedStatus);

  return {
    totalItems: query.data?.pagination.totalItems ?? 0,
    tableProps: {
      users: query.data?.items ?? [],
      rowCount: query.data?.pagination.totalItems ?? 0,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: tableState.setDensity,
      searchValue: tableState.search,
      onSearchChange: tableState.setSearch,
      selectedRole: tableState.filters.role ?? 'all',
      onRoleChange: (role: string) => tableState.setFilter('role', role === 'all' ? undefined : role),
      selectedStatus: tableState.filters.status ?? 'all',
      onStatusChange: (status: string) => tableState.setFilter('status', status === 'all' ? undefined : status),
      isFiltered,
      onClearFilters: tableState.clearFilters,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      onRetry: () => void query.refetch(),
    },
  };
};

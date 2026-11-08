import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table/data-table';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { useDataTable } from '@/hooks/use-data-table';
import type { UserListAdminItemDto } from '../../types/users.dto';
import { useUserListColumns } from './user-list-columns';
import { UserListMobileRow } from './user-list-mobile-row';
import { UserListToolbar } from './user-list-toolbar';

export interface UserListTableProps {
  users: UserListAdminItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetail: (user: UserListAdminItemDto) => void;
  onEdit: (user: UserListAdminItemDto) => void;
  onLock: (user: UserListAdminItemDto) => void;
  onUnlock: (user: UserListAdminItemDto) => void;
  onDelete: (user: UserListAdminItemDto) => void;
}

export const UserListTable = ({
  users,
  rowCount,
  state,
  handlers,
  density,
  onDensityChange,
  searchValue,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  isFiltered,
  onClearFilters,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onViewDetail,
  onEdit,
  onLock,
  onUnlock,
  onDelete,
}: UserListTableProps) => {
  const { t } = useTranslation('users');

  const columns = useUserListColumns({
    onViewDetail,
    onEdit,
    onLock,
    onUnlock,
    onDelete,
  });

  const table = useDataTable({
    data: users,
    columns,
    getRowId: (user) => user.id,
    rowCount,
    mode: 'server',
    state,
    handlers,
    features: {
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  return (
    <DataTable
      table={table}
      tableId="admin-users"
      caption={t('list.title')}
      density={density}
      onDensityChange={onDensityChange}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      isFiltered={isFiltered}
      emptyState={{
        title: t('empty.title'),
        description: t('empty.description'),
      }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filters.reset'),
        onAction: onClearFilters,
      }}
      toolbar={
        <UserListToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          isFiltered={isFiltered}
          onClearFilters={onClearFilters}
        />
      }
      onRowClick={(user) => onViewDetail(user)}
      renderMobileRow={(row) => <UserListMobileRow row={row} />}
    />
  );
};

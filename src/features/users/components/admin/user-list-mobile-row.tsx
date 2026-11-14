import type { Row } from '@tanstack/react-table';
import { UserAvatar } from '../user-avatar';
import type { UserListAdminItemDto } from '../../types/users.dto';
import { UserRoleBadge } from './user-role-badge';
import { UserStatusBadge } from './user-status-badge';

export const UserListMobileRow = ({ row }: { row: Row<UserListAdminItemDto> }) => {
  const user = row.original;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <UserAvatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-rentify-text-primary">{user.name}</p>
            <p className="truncate text-xs text-rentify-text-secondary">{user.email}</p>
          </div>
        </div>
        <UserStatusBadge status={user.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
        <span className="tabular-nums font-medium text-rentify-text-primary">{user.phone || '—'}</span>
        <UserRoleBadge role={user.role} />
      </div>
    </div>
  );
};

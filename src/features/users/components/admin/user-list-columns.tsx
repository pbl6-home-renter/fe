import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Lock, MoreHorizontal, Pencil, Trash2, Unlock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { UserAvatar } from '../user-avatar';
import { IconButton } from '@/components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserStatus } from '@/types/user';
import type { UserListAdminItemDto } from '../../types/users.dto';
import { UserRoleBadge } from './user-role-badge';
import { UserStatusBadge } from './user-status-badge';

export interface UseUserListColumnsOptions {
  onViewDetail: (user: UserListAdminItemDto) => void;
  onEdit: (user: UserListAdminItemDto) => void;
  onLock: (user: UserListAdminItemDto) => void;
  onUnlock: (user: UserListAdminItemDto) => void;
  onDelete: (user: UserListAdminItemDto) => void;
}

export const useUserListColumns = ({ onViewDetail, onEdit, onLock, onUnlock, onDelete }: UseUserListColumnsOptions) => {
  const { t } = useTranslation('users');

  return useMemo<ColumnDef<UserListAdminItemDto, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        size: 240,
        minSize: 180,
        meta: { label: t('columns.name'), pinnable: true },
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={row.original.name} src={row.original.avatarUrl} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-rentify-text-primary group-hover:text-rentify-primary">
                {row.original.name}
              </p>
              <p className="truncate text-xs text-rentify-text-secondary sm:hidden">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: t('columns.email'),
        size: 220,
        minSize: 160,
        meta: { label: t('columns.email') },
        cell: ({ row }) => <span className="truncate text-rentify-text-secondary">{row.original.email}</span>,
      },
      {
        accessorKey: 'phone',
        header: t('columns.phone'),
        size: 140,
        minSize: 120,
        meta: { label: t('columns.phone') },
        cell: ({ row }) => (
          <span className="tabular-nums text-rentify-text-secondary">{row.original.phone || '—'}</span>
        ),
      },
      {
        accessorKey: 'role',
        header: t('columns.role'),
        size: 130,
        minSize: 110,
        meta: { label: t('columns.role') },
        cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
      },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        size: 130,
        minSize: 110,
        meta: { label: t('columns.status') },
        cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 70,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => {
          const user = row.original;
          const isLocked = user.status === UserStatus.LOCKED;

          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={t('actions.more')}
                    className="h-8 w-8 text-rentify-text-secondary hover:text-rentify-text-primary"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onSelect={() => onViewDetail(user)}
                    onClick={() => onViewDetail(user)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4 text-rentify-text-secondary" />
                    <span>{t('actions.viewDetail')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => onEdit(user)} onClick={() => onEdit(user)} className="gap-2">
                    <Pencil className="h-4 w-4 text-rentify-text-secondary" />
                    <span>{t('actions.edit')}</span>
                  </DropdownMenuItem>

                  {isLocked ? (
                    <DropdownMenuItem onSelect={() => onUnlock(user)} onClick={() => onUnlock(user)} className="gap-2">
                      <Unlock className="h-4 w-4 text-rentify-success" />
                      <span>{t('actions.unlock')}</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onSelect={() => onLock(user)} onClick={() => onLock(user)} className="gap-2">
                      <Lock className="h-4 w-4 text-rentify-warning" />
                      <span>{t('actions.lock')}</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onSelect={() => onDelete(user)}
                    onClick={() => onDelete(user)}
                    className="gap-2 text-rentify-error focus:text-rentify-error"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('actions.delete')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [t, onViewDetail, onEdit, onLock, onUnlock, onDelete],
  );
};

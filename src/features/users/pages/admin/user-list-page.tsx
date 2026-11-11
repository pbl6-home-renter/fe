import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ROUTES } from '@/config/routes.config';
import { useDisclosure } from '@/hooks/use-disclosure';
import { UserDeleteDialog } from '../../components/admin/user-delete-dialog';
import { UserDetailDialog } from '../../components/admin/user-detail-dialog';
import { UserEditDialog } from '../../components/admin/user-edit-dialog';
import { UserListTable } from '../../components/admin/user-list-table';
import { UserLockDialog } from '../../components/admin/user-lock-dialog';
import { UserUnlockDialog } from '../../components/admin/user-unlock-dialog';
import { useUserList } from '../../hooks/use-user-list';
import type { UserListAdminItemDto } from '../../types/users.dto';

export const UserListPage = () => {
  const { t } = useTranslation('users');
  const navigate = useNavigate();
  const { totalItems, tableProps } = useUserList();

  const [activeUser, setActiveUser] = useState<UserListAdminItemDto | null>(null);

  const detailDisclosure = useDisclosure(false);
  const editDisclosure = useDisclosure(false);
  const lockDisclosure = useDisclosure(false);
  const unlockDisclosure = useDisclosure(false);
  const deleteDisclosure = useDisclosure(false);

  const handleViewDetail = (user: UserListAdminItemDto) => {
    setActiveUser(user);
    detailDisclosure.open();
  };

  const handleEdit = (user: UserListAdminItemDto) => {
    setActiveUser(user);
    editDisclosure.open();
  };

  const handleLock = (user: UserListAdminItemDto) => {
    setActiveUser(user);
    lockDisclosure.open();
  };

  const handleUnlock = (user: UserListAdminItemDto) => {
    setActiveUser(user);
    unlockDisclosure.open();
  };

  const handleDelete = (user: UserListAdminItemDto) => {
    setActiveUser(user);
    deleteDisclosure.open();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('list.title')}
        description={t('list.subtitle')}
        actions={
          <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rentify-divider bg-rentify-surface px-3 text-xs font-semibold text-rentify-text-primary shadow-xs">
            <Users className="h-4 w-4 text-rentify-primary" />
            <span>{t('list.totalBadge', { count: totalItems })}</span>
          </div>
        }
      />

      <UserListTable
        {...tableProps}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onDelete={handleDelete}
      />

      <UserDetailDialog
        open={detailDisclosure.isOpen}
        onClose={detailDisclosure.close}
        user={activeUser}
        onEdit={handleEdit}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onDelete={handleDelete}
        onOpenFullPage={(user) => navigate(ROUTES.ADMIN.USER_DETAIL(user.id))}
      />

      <UserEditDialog open={editDisclosure.isOpen} onClose={editDisclosure.close} user={activeUser} />

      <UserLockDialog open={lockDisclosure.isOpen} onClose={lockDisclosure.close} user={activeUser} />

      <UserUnlockDialog open={unlockDisclosure.isOpen} onClose={unlockDisclosure.close} user={activeUser} />

      <UserDeleteDialog open={deleteDisclosure.isOpen} onClose={deleteDisclosure.close} user={activeUser} />
    </div>
  );
};

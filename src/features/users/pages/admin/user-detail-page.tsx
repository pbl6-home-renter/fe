import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Lock, Pencil, Trash2, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { ROUTES } from '@/config/routes.config';
import { useDisclosure } from '@/hooks/use-disclosure';
import { UserStatus } from '@/types/user';
import { UserActivityCard } from '../../components/admin/user-activity-card';
import { UserDeleteDialog } from '../../components/admin/user-delete-dialog';
import { UserEditDialog } from '../../components/admin/user-edit-dialog';
import { UserInfoCard } from '../../components/admin/user-info-card';
import { UserLockDialog } from '../../components/admin/user-lock-dialog';
import { UserUnlockDialog } from '../../components/admin/user-unlock-dialog';
import { useUserDetailAdminQuery } from '../../hooks/use-user-detail-admin-query';

export const UserDetailPage = () => {
  const { t } = useTranslation('users');
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const query = useUserDetailAdminQuery(id);
  const user = query.data;

  const editDisclosure = useDisclosure(false);
  const lockDisclosure = useDisclosure(false);
  const unlockDisclosure = useDisclosure(false);
  const deleteDisclosure = useDisclosure(false);

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (query.isError || !user) {
    return (
      <div className="py-12">
        <ErrorState
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundDesc')}
          retryText={t('actions.retry')}
          onRetry={() => void query.refetch()}
        >
          <Button variant="outline" className="mt-4 gap-2" onClick={() => navigate(ROUTES.ADMIN.USERS)}>
            <ArrowLeft className="h-4 w-4" />
            <span>{t('detail.backToList')}</span>
          </Button>
        </ErrorState>
      </div>
    );
  }

  const isLocked = user.status === UserStatus.LOCKED;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.USERS)}
            className="h-9 w-9 p-0"
            aria-label={t('detail.backToList')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-rentify-text-primary sm:text-2xl">{user.name}</h1>
            <p className="text-xs text-rentify-text-secondary">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={editDisclosure.open} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            <span>{t('actions.edit')}</span>
          </Button>

          {isLocked ? (
            <Button
              variant="outline"
              size="sm"
              onClick={unlockDisclosure.open}
              className="gap-1.5 text-rentify-success"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>{t('actions.unlock')}</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={lockDisclosure.open} className="gap-1.5 text-rentify-warning">
              <Lock className="h-3.5 w-3.5" />
              <span>{t('actions.lock')}</span>
            </Button>
          )}

          <Button variant="danger" size="sm" onClick={deleteDisclosure.open} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t('actions.delete')}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserInfoCard user={user} />
        <UserActivityCard user={user} />
      </div>

      <UserEditDialog open={editDisclosure.isOpen} onClose={editDisclosure.close} user={user} />

      <UserLockDialog open={lockDisclosure.isOpen} onClose={lockDisclosure.close} user={user} />

      <UserUnlockDialog open={unlockDisclosure.isOpen} onClose={unlockDisclosure.close} user={user} />

      <UserDeleteDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        user={user}
        onSuccess={() => navigate(ROUTES.ADMIN.USERS)}
      />
    </div>
  );
};

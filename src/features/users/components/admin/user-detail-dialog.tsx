import { useTranslation } from 'react-i18next';
import { ExternalLink, Lock, Pencil, Trash2, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { UserStatus } from '@/types/user';
import { useUserDetailAdminQuery } from '../../hooks/use-user-detail-admin-query';
import type { UserListAdminItemDto } from '../../types/users.dto';
import { UserActivityCard } from './user-activity-card';
import { UserInfoCard } from './user-info-card';

export interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserListAdminItemDto | null;
  onEdit: (user: UserListAdminItemDto) => void;
  onLock: (user: UserListAdminItemDto) => void;
  onUnlock: (user: UserListAdminItemDto) => void;
  onDelete: (user: UserListAdminItemDto) => void;
  onOpenFullPage: (user: UserListAdminItemDto) => void;
}

export const UserDetailDialog = ({
  open,
  onClose,
  user: targetUser,
  onEdit,
  onLock,
  onUnlock,
  onDelete,
  onOpenFullPage,
}: UserDetailDialogProps) => {
  const { t } = useTranslation('users');
  const userId = targetUser?.id ?? '';

  const query = useUserDetailAdminQuery(userId, {
    enabled: open && Boolean(userId),
  });

  const detailUser = query.data;

  if (!targetUser) return null;

  const isLocked = (detailUser?.status ?? targetUser.status) === UserStatus.LOCKED;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('dialogs.detail.title')}
      description={targetUser.email}
      maxWidth="2xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose();
              onOpenFullPage(targetUser);
            }}
            className="gap-1.5 text-rentify-primary"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t('dialogs.detail.openFullPage')}</span>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(targetUser);
              }}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>{t('actions.edit')}</span>
            </Button>

            {isLocked ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onUnlock(targetUser);
                }}
                className="gap-1.5 text-rentify-success"
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>{t('actions.unlock')}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onLock(targetUser);
                }}
                className="gap-1.5 text-rentify-warning"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{t('actions.lock')}</span>
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(targetUser);
              }}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t('actions.delete')}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={onClose}>
              {t('actions.close')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {query.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : query.isError || !detailUser ? (
          <ErrorState
            title={t('detail.notFoundTitle')}
            message={t('detail.notFoundDesc')}
            retryText={t('actions.retry')}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <div className="space-y-4">
            <UserInfoCard user={detailUser} />
            <UserActivityCard user={detailUser} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

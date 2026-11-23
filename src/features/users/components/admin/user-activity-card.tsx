import { useTranslation } from 'react-i18next';
import { Activity, Building2, CreditCard, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Skeleton } from '@/components/feedback/skeleton';
import { formatDateTime } from '@/lib/utils/format';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user';
import { useAdminBuildingsQuery } from '@/features/buildings/hooks/admin/use-admin-buildings-query';
import type { UserDetailAdminDto } from '../../types/users.dto';

export const UserActivityCard = ({ user }: { user: UserDetailAdminDto }) => {
  const { t } = useTranslation('users');
  const isLocked = user.status === UserStatus.LOCKED;
  const isLandlord = user.role === Role.LANDLORD;
  const isTenant = user.role === Role.TENANT;
  const isAdmin = user.role === Role.ADMIN;

  const buildingsQuery = useAdminBuildingsQuery({
    filter: { landlordId: user.id },
    pageSize: 1,
  });

  const buildingCount = user.buildingCount ?? (isLandlord ? buildingsQuery.data?.pagination.totalItems : null) ?? 0;

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-rentify-text-primary">
          <Activity className="h-5 w-5 text-rentify-primary" />
          <span>{t('detail.activityTitle')}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {isLandlord && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-rentify-text-secondary">{t('detail.managedBuildings')}</p>
                {buildingsQuery.isLoading ? (
                  <Skeleton className="mt-1 h-6 w-12 rounded" />
                ) : (
                  <p className="text-lg font-bold text-rentify-text-primary tabular-nums">{buildingCount}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-rentify-text-secondary">{t('detail.payoutStatus')}</p>
                <p className="truncate text-sm font-semibold text-rentify-text-primary">
                  {user.payoutAccount
                    ? t('detail.payoutConfigured', { bank: user.payoutAccount.bankCode })
                    : t('detail.payoutNotConfigured')}
                </p>
              </div>
            </div>
          </div>
        )}

        {isTenant && (
          <div className="flex items-start gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rentify-text-primary">{t('detail.tenantRoleTitle')}</p>
              <p className="mt-0.5 text-xs text-rentify-text-secondary">{t('detail.tenantRoleDesc')}</p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="flex items-start gap-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rentify-text-primary">{t('detail.adminSystemTitle')}</p>
              <p className="mt-0.5 text-xs text-rentify-text-secondary">{t('detail.adminSystemDesc')}</p>
            </div>
          </div>
        )}

        {isLocked ? (
          <div className="space-y-2 rounded-xl border border-rentify-error/20 bg-rentify-error/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-rentify-error">
              <Lock className="h-4 w-4" />
              <span>{t('detail.lockDetailsTitle')}</span>
            </div>
            <p className="text-xs text-rentify-text-primary">
              <span className="font-medium text-rentify-text-secondary">{t('fields.lockReason')}: </span>
              {user.lockReason || t('detail.noLockReason')}
            </p>
            {user.lockedAt && (
              <p className="text-xs text-rentify-text-secondary tabular-nums">
                <span>{t('detail.lockedAt')}: </span>
                {formatDateTime(user.lockedAt)}
              </p>
            )}
          </div>
        ) : (
          <AlertBanner variant="info" title={t('detail.accountInGoodStandingTitle')}>
            {t('detail.accountInGoodStandingDesc')}
          </AlertBanner>
        )}
      </CardContent>
    </Card>
  );
};

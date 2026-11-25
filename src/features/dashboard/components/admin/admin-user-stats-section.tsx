import { useTranslation } from 'react-i18next';
import { Users, UserCheck, KeyRound, Lock, MailWarning, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardButton } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import type { UserStatsDto } from '../../types/admin-dashboard.dto';

export interface AdminUserStatsSectionProps {
  data?: UserStatsDto;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onLockedUsersClick: () => void;
}

export const AdminUserStatsSection = ({
  data,
  isLoading,
  isError,
  onRetry,
  onLockedUsersClick,
}: AdminUserStatsSectionProps) => {
  const { t } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <section className="space-y-4" aria-labelledby="user-stats-heading">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 rounded-2xl flex flex-col justify-between h-32">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="space-y-4" aria-labelledby="user-stats-heading">
        <h2 id="user-stats-heading" className="text-lg font-bold text-rentify-text-primary tracking-tight">
          {t('admin.usersSectionTitle')}
        </h2>
        <Card className="p-6 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs">
          <ErrorState title={t('admin.usersErrorTitle')} message={t('admin.usersErrorDesc')} onRetry={onRetry} />
        </Card>
      </section>
    );
  }

  const { totalUsers, byRole, byStatus } = data;

  return (
    <section className="space-y-4" aria-labelledby="user-stats-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 id="user-stats-heading" className="text-lg font-bold text-rentify-text-primary tracking-tight">
            {t('admin.usersSectionTitle')}
          </h2>
          <p className="text-xs text-rentify-text-secondary mt-0.5">{t('admin.usersSectionSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Tổng tài khoản */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.totalUsers')}</span>
            <Users className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {totalUsers}
            </span>
            <span className="text-[11px] font-semibold text-rentify-primary bg-primary-container/20 px-2 py-0.5 rounded-full">
              {t('admin.allTag')}
            </span>
          </div>
        </Card>

        {/* 2. Chủ trọ */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.landlords')}</span>
            <KeyRound className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {byRole.landlord}
            </span>
          </div>
        </Card>

        {/* 3. Người thuê */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.tenants')}</span>
            <UserCheck className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {byRole.tenant}
            </span>
          </div>
        </Card>

        {/* 4. Đang hoạt động */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.activeUsers')}</span>
            <CheckCircle2 className="w-4 h-4 text-rentify-success" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-success tracking-tight tabular-nums">
              {byStatus.active}
            </span>
            <span className="text-[11px] font-semibold text-rentify-success bg-rentify-success/10 px-2 py-0.5 rounded-full">
              {t('full.statusActiveTag')}
            </span>
          </div>
        </Card>

        {/* 5. Đang bị khóa (Bấm vào -> lọc locked) */}
        <CardButton
          onClick={onLockedUsersClick}
          className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between group"
          aria-label={t('admin.lockedUsersHint')}
        >
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold text-rentify-error">{t('admin.lockedUsers')}</span>
            <Lock className="w-4 h-4 text-rentify-error" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-error tracking-tight tabular-nums">
              {byStatus.locked}
            </span>
            <span className="text-[11px] font-semibold text-rentify-error bg-rentify-error/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 group-hover:bg-rentify-error/15 transition-colors">
              {t('admin.viewListTag')}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </CardButton>

        {/* 6. Chưa xác thực email */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.pendingVerification')}</span>
            <MailWarning className="w-4 h-4 text-rentify-warning" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-warning tracking-tight tabular-nums">
              {byStatus.pendingVerification}
            </span>
            <span className="text-[11px] font-semibold text-rentify-warning bg-rentify-warning/10 px-2 py-0.5 rounded-full">
              {t('admin.unverifiedTag')}
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
};

import { useTranslation } from 'react-i18next';
import { RotateCw, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AdminHomeBannerProps {
  userName?: string;
  formattedUpdatedTime?: string | null;
  isRefetching?: boolean;
  onRefresh?: () => void;
  onNavigateBuildings?: () => void;
  onNavigateUsers?: () => void;
}

export const AdminHomeBanner = ({
  userName,
  formattedUpdatedTime,
  isRefetching = false,
  onRefresh,
  onNavigateBuildings,
  onNavigateUsers,
}: AdminHomeBannerProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-gradient px-6 py-8 sm:px-12 sm:py-10 text-white shadow-card min-h-[180px] sm:min-h-[210px] flex flex-col justify-center">
      {/* Decorative subtle ambient circles matching Tenant & Landlord Banners */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          {userName && (
            <p className="text-xs sm:text-sm font-medium tracking-wide text-white/80">
              {t('full.greeting', { name: userName })}
            </p>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{t('admin.dashboardTitle')}</h1>
          <p className="text-xs sm:text-sm text-white/80 pt-1 leading-relaxed">{t('admin.dashboardSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {formattedUpdatedTime && (
            <span className="bg-white/15 text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-xs shadow-xs">
              {t('admin.updatedAt', { time: formattedUpdatedTime })}
            </span>
          )}

          {onNavigateBuildings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateBuildings}
              className="bg-white/15 text-white hover:bg-white hover:text-primary border-white/20 rounded-full px-4 h-10 text-xs font-bold backdrop-blur-xs shadow-xs transition-all gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('admin.navBuildingsShortcut')}</span>
            </Button>
          )}

          {onNavigateUsers && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateUsers}
              className="bg-white/15 text-white hover:bg-white hover:text-primary border-white/20 rounded-full px-4 h-10 text-xs font-bold backdrop-blur-xs shadow-xs transition-all gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('admin.navUsersShortcut')}</span>
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="primary"
              size="sm"
              onClick={onRefresh}
              disabled={isRefetching}
              className="bg-white text-primary hover:bg-white/95 rounded-full px-5 h-10 text-xs font-extrabold gap-2 shadow-sm transition-all"
            >
              <RotateCw
                className={`w-3.5 h-3.5 text-primary ${isRefetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{isRefetching ? t('admin.refreshing') : t('admin.refresh')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

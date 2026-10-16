import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';
import { useAuth } from '@/hooks/use-auth';
import type { Role } from '@/types/role';

export interface DashboardOverviewConfig {
  title?: string;
  desc?: string;
  titleKey?: ParseKeys<'common'>;
  descKey?: ParseKeys<'common'>;
}

export interface DashboardOverviewProps {
  title?: string;
  desc?: string;
  titleKey?: ParseKeys<'common'>;
  descKey?: ParseKeys<'common'>;
  roleConfig?: Partial<Record<Role, DashboardOverviewConfig>>;
}

export const DashboardOverview = ({
  title,
  desc,
  titleKey,
  descKey,
  roleConfig,
}: DashboardOverviewProps) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const roleSpecific = role ? roleConfig?.[role] : undefined;

  const currentTitleKey = roleSpecific?.titleKey || titleKey;
  const currentDescKey = roleSpecific?.descKey || descKey;

  const displayTitle = currentTitleKey
    ? t(currentTitleKey)
    : roleSpecific?.title || title || t('routes.dashboard.defaultTitle');

  const displayDesc = currentDescKey
    ? t(currentDescKey)
    : roleSpecific?.desc || desc || t('routes.dashboard.defaultDesc');

  return (
    <div className="space-y-4">
      <div className="bg-rentify-surface rounded-2xl p-6 sm:p-8 border border-rentify-divider shadow-xs">
        <h1 className="text-2xl font-bold text-rentify-text-primary tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-sm text-rentify-text-secondary mt-1">
          {displayDesc}
        </p>
      </div>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { Role } from '@/types/role';
import { PageHeader } from '@/components/ui/page-header';

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

export const DashboardOverview = ({ title, desc, titleKey, descKey, roleConfig }: DashboardOverviewProps) => {
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
    <div className="space-y-6">
      <PageHeader title={displayTitle} description={displayDesc} />
    </div>
  );
};

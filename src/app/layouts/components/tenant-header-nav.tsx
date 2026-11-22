import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { cn } from '@/lib/utils/cn';

export interface TenantHeaderNavProps {
  unreadChatCount?: number;
}

export const TenantHeaderNav = ({ unreadChatCount = 0 }: TenantHeaderNavProps) => {
  const { t } = useTranslation('common');
  const location = useLocation();

  const isExploreActive =
    location.pathname === ROUTES.TENANT.DASHBOARD ||
    location.pathname === ROUTES.HOME ||
    location.pathname === ROUTES.ROOMS_SEARCH;
  const isChatActive = location.pathname.startsWith('/chat');
  const isRoomsActive = location.pathname.startsWith('/rooms') && location.pathname !== ROUTES.ROOMS_SEARCH;
  const isContractsActive = location.pathname.startsWith('/contracts');
  const isIssuesActive = location.pathname.startsWith('/issues');
  const isRoommatesActive = location.pathname.startsWith('/roommates');

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold h-16">
      <Link
        to={ROUTES.TENANT.DASHBOARD}
        className={cn(
          'h-full flex items-center relative transition-colors',
          isExploreActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.explore')}</span>
        {isExploreActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
      </Link>

      <Link
        to={ROUTES.TENANT.CHAT}
        className={cn(
          'h-full flex items-center relative gap-1.5 transition-colors',
          isChatActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.chat')}</span>
        {unreadChatCount > 0 && (
          <span className="rounded-full bg-rentify-primary-container text-rentify-primary px-1.5 py-0.5 text-[10px] font-bold leading-none">
            {unreadChatCount > 99 ? '99+' : unreadChatCount}
          </span>
        )}
        {isChatActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
      </Link>

      <Link
        to={ROUTES.TENANT.ROOMS}
        className={cn(
          'h-full flex items-center relative transition-colors',
          isRoomsActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.myRoom')}</span>
        {isRoomsActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
      </Link>

      <Link
        to={ROUTES.TENANT.CONTRACTS}
        className={cn(
          'h-full flex items-center relative transition-colors',
          isContractsActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.contracts')}</span>
        {isContractsActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
        )}
      </Link>

      <Link
        to={ROUTES.TENANT.ISSUES}
        className={cn(
          'h-full flex items-center relative transition-colors',
          isIssuesActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.issues')}</span>
        {isIssuesActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
      </Link>

      <Link
        to={ROUTES.TENANT.ROOMMATES}
        className={cn(
          'h-full flex items-center relative transition-colors',
          isRoommatesActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
        )}
      >
        <span>{t('navigation.roommatesShort')}</span>
        {isRoommatesActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
        )}
      </Link>
    </nav>
  );
};

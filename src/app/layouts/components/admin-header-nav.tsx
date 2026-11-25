import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { cn } from '@/lib/utils/cn';

export const AdminHeaderNav = () => {
  const { t } = useTranslation('common');
  const location = useLocation();

  const navItems = [
    {
      to: ROUTES.ADMIN.DASHBOARD,
      label: t('navigation.admin.systemStats'),
      isActive: location.pathname === ROUTES.ADMIN.DASHBOARD,
    },
    {
      to: ROUTES.ADMIN.BUILDINGS,
      label: t('navigation.admin.approvals'),
      isActive: location.pathname.startsWith(ROUTES.ADMIN.BUILDINGS),
    },
    {
      to: ROUTES.ADMIN.USERS,
      label: t('navigation.admin.users'),
      isActive: location.pathname.startsWith(ROUTES.ADMIN.USERS),
    },
    {
      to: ROUTES.ADMIN.AUDIT_LOGS,
      label: t('navigation.admin.auditLogs'),
      isActive: location.pathname.startsWith(ROUTES.ADMIN.AUDIT_LOGS),
    },
    {
      to: ROUTES.ADMIN.SETTINGS,
      label: t('navigation.admin.settings'),
      isActive: location.pathname.startsWith(ROUTES.ADMIN.SETTINGS),
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-3 xl:gap-5 text-xs lg:text-sm font-semibold h-16 overflow-x-auto no-scrollbar">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            'h-full flex items-center relative gap-1 px-1.5 transition-colors shrink-0',
            item.isActive ? 'text-rentify-primary' : 'text-rentify-text-secondary hover:text-rentify-text-primary',
          )}
        >
          <span>{item.label}</span>
          {item.isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
        </Link>
      ))}
    </nav>
  );
};

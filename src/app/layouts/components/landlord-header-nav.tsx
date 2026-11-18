import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { cn } from '@/lib/utils/cn';

export interface LandlordHeaderNavProps {
  unreadChatCount?: number;
}

export const LandlordHeaderNav = ({ unreadChatCount = 0 }: LandlordHeaderNavProps) => {
  const { t } = useTranslation('common');
  const location = useLocation();

  const navItems = [
    {
      to: ROUTES.LANDLORD.DASHBOARD,
      label: t('navigation.overview'),
      isActive: location.pathname === ROUTES.LANDLORD.DASHBOARD,
    },
    {
      to: ROUTES.LANDLORD.BUILDINGS,
      label: t('navigation.rooms'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.BUILDINGS),
    },
    {
      to: ROUTES.LANDLORD.CONTRACTS,
      label: t('navigation.contracts'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.CONTRACTS),
    },
    {
      to: ROUTES.LANDLORD.INVOICES,
      label: t('navigation.invoices'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.INVOICES),
    },
    {
      to: ROUTES.LANDLORD.METER_READINGS,
      label: t('navigation.meterReadings'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.METER_READINGS),
    },
    {
      to: ROUTES.LANDLORD.ISSUES,
      label: t('navigation.issues'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.ISSUES),
    },
    {
      to: ROUTES.LANDLORD.TENANTS,
      label: t('navigation.tenants'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.TENANTS),
    },
    {
      to: ROUTES.LANDLORD.CHAT,
      label: t('navigation.chat'),
      isActive: location.pathname.startsWith(ROUTES.LANDLORD.CHAT),
      badge: unreadChatCount > 0 ? (unreadChatCount > 99 ? '99+' : unreadChatCount) : undefined,
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
          {item.badge && (
            <span className="rounded-full bg-rentify-primary-container text-rentify-primary px-1.5 py-0.5 text-[10px] font-bold leading-none">
              {item.badge}
            </span>
          )}
          {item.isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />}
        </Link>
      ))}
    </nav>
  );
};

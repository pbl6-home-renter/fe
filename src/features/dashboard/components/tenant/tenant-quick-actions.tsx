import { useTranslation } from 'react-i18next';
import { ChevronRight, Heart, Lock, MapPin, Receipt, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

export interface TenantQuickActionsProps {
  isAuthenticated: boolean;
  unpaidCount: number;
  layout?: 'horizontal' | 'vertical';
  onAction: (action: 'nearMe' | 'saved' | 'roommates' | 'invoices') => void;
}

export const TenantQuickActions = ({
  isAuthenticated,
  unpaidCount,
  layout = 'horizontal',
  onAction,
}: TenantQuickActionsProps) => {
  const { t } = useTranslation('dashboard');

  const items = [
    {
      id: 'nearMe' as const,
      title: t('tenantHome.nearMe'),
      desc: t('tenantHome.nearMeDesc'),
      icon: MapPin,
      iconBg: 'bg-primary-container text-rentify-primary',
      requiresAuth: false,
      badge: false,
    },
    {
      id: 'saved' as const,
      title: t('tenantHome.savedRooms'),
      desc: t('tenantHome.savedRoomsDesc'),
      icon: Heart,
      iconBg: 'bg-rentify-error/10 text-rentify-error',
      requiresAuth: true,
      badge: false,
    },
    {
      id: 'roommates' as const,
      title: t('tenantHome.roommates'),
      desc: t('tenantHome.roommatesDesc'),
      icon: Users,
      iconBg: 'bg-slate-surface text-rentify-primary',
      requiresAuth: true,
      badge: false,
    },
    {
      id: 'invoices' as const,
      title: t('tenantHome.invoices'),
      desc: isAuthenticated
        ? unpaidCount > 0
          ? t('tenantHome.invoicesDescUnpaid', { count: unpaidCount })
          : t('tenantHome.invoicesDescPaid')
        : t('tenantHome.invoicesDescGuest'),
      icon: Receipt,
      iconBg: 'bg-teal-surface text-teal-primary border border-teal-border',
      requiresAuth: true,
      badge: unpaidCount > 0,
    },
  ];

  if (layout === 'vertical') {
    return (
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between h-full space-y-2">
        <h2 className="text-sm font-bold text-rentify-text-primary px-1 pb-1">{t('tenantHome.quickActionsTitle')}</h2>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onAction(item.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rentify-background transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      item.iconBg,
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rentify-error ring-2 ring-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{t('tenantHome.quickActionsTitle')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const showLock = item.requiresAuth && !isAuthenticated;

          return (
            <Card
              key={item.id}
              variant="interactive"
              onClick={() => onAction(item.id)}
              className="relative p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex items-center justify-between cursor-pointer group hover:border-rentify-primary/40 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs',
                    item.iconBg,
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rentify-error ring-2 ring-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{item.desc}</p>
                </div>
              </div>

              {showLock ? (
                <Lock className="w-3.5 h-3.5 text-rentify-text-muted shrink-0 ml-2" />
              ) : (
                <ChevronRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { cn } from '@/lib/utils/cn';
import { MOTION_DURATION, MOTION_EASE, MOTION_EXIT_EASE } from '@/lib/motion';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { IconButton } from '@/components/ui/icon-button';
import { getNavigationByRole } from '@/config/navigation.config';
import { useUnreadSummaryQuery } from '@/features/chat/hooks/use-chat-queries';
import { CHAT_UNREAD_BADGE_MAX } from '@/features/chat/constants/chat.constants';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { role } = useAuth();
  const { t } = useTranslation('common');

  const menuItems = getNavigationByRole(role);
  const unread = useUnreadSummaryQuery(role === Role.LANDLORD || role === Role.TENANT);

  useEffect(() => {
    if (!open || window.matchMedia('(min-width: 768px)').matches) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'Tab') {
        const focusable = Array.from(
          sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, onClose]);

  return (
    <>
      {/* Mobile Drawer Backdrop Scrim */}
      <AnimatePresence>
        {open && (
          <m.div
            key="sidebar-backdrop"
            role="presentation"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: MOTION_DURATION.drawer, ease: MOTION_EASE } }}
            exit={{
              opacity: 0,
              pointerEvents: 'none',
              transition: { duration: MOTION_DURATION.dialogExit, ease: MOTION_EXIT_EASE },
            }}
            className="fixed inset-0 z-40 bg-rentify-text-primary/40 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Aside */}
      <aside
        ref={sidebarRef}
        id="app-sidebar"
        data-open={open}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-rentify-surface border-r border-rentify-divider',
          'ui-mobile-drawer flex flex-col md:static',
          open && 'shadow-2xl',
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-rentify-divider shrink-0">
            <RentifyLogo role={role} size="md" />

            {/* Close button for mobile */}
            <IconButton
              ref={closeButtonRef}
              variant="ghost"
              size="md"
              onClick={onClose}
              aria-label={t('closeDialog')}
              className="md:hidden"
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          {/* Navigation Links */}
          <nav aria-label={t('menuTitle')} className="p-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-bold text-rentify-neutral uppercase tracking-wider">
              {t('menuTitle')}
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-10 items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow] duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-rentify-primary text-rentify-on-primary shadow-sm font-semibold'
                        : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{t(item.titleKey)}</span>
                      </div>

                      {(item.badge !== undefined ||
                        ((item.id === 'landlord-chat' || item.id === 'tenant-chat') &&
                          (unread.data?.totalUnreadCount ?? 0) > 0)) && (
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-bold leading-none',
                            isActive
                              ? 'bg-rentify-on-primary/20 text-rentify-on-primary'
                              : item.badgeVariant === 'danger'
                                ? 'bg-rentify-error/15 text-rentify-error'
                                : 'bg-rentify-primary-container text-rentify-primary',
                          )}
                        >
                          {item.id === 'landlord-chat' || item.id === 'tenant-chat'
                            ? (unread.data?.totalUnreadCount ?? 0) > CHAT_UNREAD_BADGE_MAX
                              ? `${CHAT_UNREAD_BADGE_MAX}+`
                              : unread.data?.totalUnreadCount
                            : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

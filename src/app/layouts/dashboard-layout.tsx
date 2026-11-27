import { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { RouteFade } from '@/components/ui/route-fade';
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';
import { LogoutModal } from './components/logout-modal';
import { AppFooter } from './components/app-footer';
import { isChatPath } from '@/features/chat/constants/chat.constants';
import { cn } from '@/lib/utils/cn';
import { LockedAccountBanner } from '@/features/moderation/components/locked-account-banner';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps = {}) => {
  const { role } = useAuth();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const isChatRoute = isChatPath(location.pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleOpenLogoutModal = useCallback(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
      window.requestAnimationFrame(() => setLogoutModalOpen(true));
    } else {
      setLogoutModalOpen(true);
    }
  }, [sidebarOpen]);

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Handled in onError (clearAuth and toast)
    } finally {
      setLogoutModalOpen(false);
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  return (
    <div
      className={cn(
        'bg-rentify-background flex flex-col font-sans antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-rentify-surface',
        isChatRoute ? 'h-screen overflow-hidden' : 'min-h-screen',
      )}
    >
      {/* Mobile slide-over drawer for all portal roles */}
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Unified Topbar with Header tabs (Tenant, Landlord, Admin) */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(true)}
        onOpenLogoutModal={handleOpenLogoutModal}
      />

      {/* Main Content Area matching PublicLayout container */}
      <main
        className={
          isChatRoute
            ? 'flex-1 min-h-0 h-[calc(100vh-4rem)] overflow-hidden bg-rentify-background'
            : 'flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }
      >
        <RouteFade
          pathname={location.pathname}
          disabled={isChatRoute}
          className={isChatRoute ? 'h-full min-h-0 w-full' : 'w-full'}
        >
          {!isChatRoute && <LockedAccountBanner />}
          {children ?? <Outlet />}
        </RouteFade>
      </main>

      {/* Unified Footer */}
      {!isChatRoute && <AppFooter role={role} />}

      {/* Accessible Logout Confirmation Modal */}
      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
};

import { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { RouteFade } from '@/components/ui/route-fade';
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';
import { LogoutModal } from './components/logout-modal';
import { AppFooter } from './components/app-footer';
import { isChatPath } from '@/features/chat/constants/chat.constants';
import { cn } from '@/lib/utils/cn';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps = {}) => {
  const { role } = useAuth();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const isChatRoute = isChatPath(location.pathname);
  const isTenant = role === Role.TENANT;

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

  if (isTenant) {
    return (
      <div
        className={cn(
          'bg-rentify-background flex flex-col font-sans antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-rentify-surface',
          isChatRoute ? 'h-screen overflow-hidden' : 'min-h-screen',
        )}
      >
        {/* Mobile slide-over drawer for Tenant */}
        <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} />

        {/* Unified Topbar with Header tabs */}
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
            {children ?? <Outlet />}
          </RouteFade>
        </main>

        {/* Unified Footer for Tenant */}
        {!isChatRoute && <AppFooter role={Role.TENANT} />}

        {/* Accessible Logout Confirmation Modal */}
        <LogoutModal
          open={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
          isLoading={logoutMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col md:flex-row font-sans antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-rentify-surface">
      {/* Role-based Responsive Navigation Sidebar for Landlord & Admin */}
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area for Landlord & Admin */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header Topbar with Breadcrumbs */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenLogoutModal={handleOpenLogoutModal}
        />

        {/* Standardized Content Container for Landlord/Admin Features */}
        <main
          className={
            isChatRoute
              ? 'flex-1 min-h-0 h-[calc(100vh-4rem)] overflow-hidden bg-rentify-background'
              : 'flex-1 overflow-y-auto bg-rentify-background p-4 sm:p-6 lg:p-8'
          }
        >
          <RouteFade
            pathname={location.pathname}
            disabled={isChatRoute}
            className={isChatRoute ? 'h-full min-h-0 w-full' : 'max-w-360 mx-auto w-full'}
          >
            {children ?? <Outlet />}
          </RouteFade>
        </main>
      </div>

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

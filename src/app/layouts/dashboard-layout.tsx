import { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { RouteFade } from '@/components/ui/route-fade';
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';
import { LogoutModal } from './components/logout-modal';
import { isChatPath } from '@/features/chat/constants/chat.constants';

export const DashboardLayout = () => {
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
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col md:flex-row antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-white">
      {/* Role-based Responsive Navigation Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} onOpenLogoutModal={handleOpenLogoutModal} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header Topbar */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenLogoutModal={handleOpenLogoutModal}
        />

        {/* Standardized Content Container for Features */}
        <main
          className={
            isChatRoute
              ? 'flex-1 min-h-0 overflow-hidden bg-rentify-background'
              : 'flex-1 overflow-y-auto bg-rentify-background p-4 sm:p-6 lg:p-8'
          }
        >
          <RouteFade
            pathname={location.pathname}
            disabled={isChatRoute}
            className={isChatRoute ? 'h-full min-h-0 w-full' : 'max-w-360 mx-auto w-full'}
          >
            <Outlet />
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

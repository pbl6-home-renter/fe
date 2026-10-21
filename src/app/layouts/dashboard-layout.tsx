import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';
import { LogoutModal } from './components/logout-modal';

export const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    try {
      logout();
      setLogoutModalOpen(false);
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col md:flex-row antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-white">
      {/* Role-based Responsive Navigation Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenLogoutModal={() => setLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header Topbar */}
        <Header
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenLogoutModal={() => setLogoutModalOpen(true)}
        />

        {/* Standardized Content Container for Features */}
        <main className="flex-1 overflow-y-auto bg-rentify-background p-4 sm:p-6 lg:p-8">
          <div className="max-w-360 mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Accessible Logout Confirmation Modal */}
      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

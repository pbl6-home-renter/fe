import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Receipt,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  UserCheck,
  Settings,
  Bell,
  LogOut,
  Globe,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { changeLanguage } from '@/i18n/i18n';

interface MenuItem {
  title: string;
  path: string;
  icon: typeof LayoutDashboard;
}

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const { i18n } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic menu according to role
  const landlordMenu: MenuItem[] = [
    { title: 'Tổng quan', path: '/landlord', icon: LayoutDashboard },
    { title: 'Quản lý nhà / phòng', path: '/landlord/rooms', icon: Building },
    { title: 'Khách thuê', path: '/landlord/tenants', icon: Users },
    { title: 'Hợp đồng', path: '/landlord/contracts', icon: FileText },
    { title: 'Hoá đơn', path: '/landlord/invoices', icon: Receipt },
    { title: 'Sự cố', path: '/landlord/issues', icon: AlertTriangle },
  ];

  const adminMenu: MenuItem[] = [
    { title: 'Thống kê hệ thống', path: '/admin', icon: BarChart3 },
    { title: 'Duyệt chủ trọ', path: '/admin/approvals', icon: CheckCircle },
    { title: 'Quản lý tài khoản', path: '/admin/users', icon: UserCheck },
    { title: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  const tenantMenu: MenuItem[] = [
    { title: 'Tổng quan phòng', path: '/tenant', icon: LayoutDashboard },
    { title: 'Hợp đồng thuê', path: '/tenant/contracts', icon: FileText },
    { title: 'Hóa đơn tiền nhà', path: '/tenant/invoices', icon: Receipt },
    { title: 'Báo sự cố', path: '/tenant/issues', icon: AlertTriangle },
  ];

  const menuItems =
    role === 'admin' ? adminMenu : role === 'landlord' ? landlordMenu : tenantMenu;

  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLang);
  };

  // Generate dynamic breadcrumb
  const currentPathSegment = location.pathname.split('/').filter(Boolean);
  const breadcrumbTitle =
    menuItems.find((item) => item.path === location.pathname)?.title ||
    (currentPathSegment.length > 0
      ? currentPathSegment[currentPathSegment.length - 1].toUpperCase()
      : 'Dashboard');

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col md:flex-row antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-rentify-surface border-r border-rentify-divider',
          'flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-rentify-divider">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rentify-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-rentify-text-primary tracking-tight">
                  Rentify
                </span>
                <span className="text-[10px] font-semibold text-rentify-primary uppercase tracking-wider -mt-1">
                  {role || 'Portal'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-lg text-rentify-text-secondary hover:bg-rentify-background md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-bold text-rentify-neutral uppercase tracking-wider">
              Menu quản lý
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/landlord' || item.path === '/admin' || item.path === '/tenant'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-rentify-primary-container text-rentify-primary shadow-xs font-semibold'
                        : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card in Sidebar Bottom */}
        <div className="p-4 border-t border-rentify-divider">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-rentify-background">
            <div className="w-9 h-9 rounded-full bg-rentify-primary-container text-rentify-primary flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-rentify-text-primary truncate">
                {user?.name || 'Người dùng'}
              </p>
              <p className="text-[11px] text-rentify-text-secondary truncate">
                {user?.email || 'user@rentify.vn'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-rentify-surface border-b border-rentify-divider px-4 sm:px-6 flex items-center justify-between shrink-0">
          {/* Left: Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-xl text-rentify-text-secondary hover:bg-rentify-background md:hidden cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-rentify-text-secondary capitalize">
                {role || 'Dashboard'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-rentify-neutral" />
              <span className="font-semibold text-rentify-text-primary">
                {breadcrumbTitle}
              </span>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rentify-text-secondary hover:bg-rentify-background border border-rentify-divider transition-colors cursor-pointer"
              title="Chuyển ngôn ngữ"
            >
              <Globe className="w-3.5 h-3.5 text-rentify-primary" />
              <span className="font-bold uppercase">{currentLanguage}</span>
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-rentify-text-secondary hover:bg-rentify-background transition-colors cursor-pointer"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rentify-error ring-2 ring-white" />
            </button>

            <div className="h-4 w-px bg-rentify-divider mx-0.5" />

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-xs text-rentify-error hover:bg-red-50 hover:text-rentify-error"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


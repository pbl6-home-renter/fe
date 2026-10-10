import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

export const DashboardLayout = () => {
  const { user, clearAuth } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#F8FBFE] flex flex-col">
      <header className="h-16 bg-white border-b border-[#D7E3F2] px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0056b3] text-white flex items-center justify-center font-bold">
            R
          </div>
          <span className="font-bold text-lg text-[#021b3d]">Rentify</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#4a607d]">
            {user?.name} ({user?.role})
          </span>
          <Button variant="ghost" size="sm" onClick={clearAuth}>
            Đăng xuất
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


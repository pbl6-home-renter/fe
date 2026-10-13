import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Building2, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-rentify-background,#F8FBFE)] flex flex-col justify-between antialiased">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-rentify-primary,#1E6FD9)] text-white flex items-center justify-center font-bold text-xl shadow-md transition-transform group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[var(--color-rentify-text-primary,#142A4C)]">
              Rentify
            </span>
            <span className="text-[11px] font-medium text-[var(--color-rentify-text-secondary,#5C7290)] -mt-1">
              Smart Rental Platform
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--color-rentify-text-secondary,#5C7290)]">
          <ShieldCheck className="w-4 h-4 text-[var(--color-rentify-success,#16A34A)]" />
          <span>Hệ thống bảo mật 2 lớp SSL</span>
        </div>
      </header>

      {/* Main Content (Centered Card or Split Layout) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center sm:flex sm:justify-between sm:items-center text-xs text-[var(--color-rentify-text-secondary,#5C7290)] border-t border-[var(--color-rentify-divider,#D7E3F2)]/60">
        <div className="flex items-center justify-center gap-4 mb-2 sm:mb-0">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[var(--color-rentify-primary,#1E6FD9)]" />
            Quản lý căn hộ & tòa nhà
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-rentify-warning,#F59E0B)]" />
            Hợp đồng điện tử VietQR
          </span>
        </div>
        <p>© 2026 Rentify. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;


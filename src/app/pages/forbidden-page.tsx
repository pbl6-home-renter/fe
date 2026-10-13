import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { Button } from '@/components/ui/button';

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const homePath = getHomePathByRole(user?.role);

  return (
    <main className="w-full min-h-screen bg-[#F8FBFE] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center">
        {/* Glow effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1e6fd9]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-[#ba1a1a]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#0056b3] text-white flex items-center justify-center font-bold text-base shadow-sm">
            R
          </div>
          <span className="text-xl font-bold text-[#021b3d] tracking-tight">Rentify</span>
          <span className="text-[#4a607d] text-xs font-medium">· Bảo mật hệ thống</span>
        </div>

        {/* Card */}
        <div className="relative w-full bg-white rounded-[24px] border border-[#D7E3F2] p-6 sm:p-10 shadow-[0_12px_32px_-4px_rgba(30,111,217,0.08),0_4px_12px_-2px_rgba(30,111,217,0.03)] text-center flex flex-col items-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#ffdad6]/40 flex items-center justify-center mb-5 text-[#ba1a1a]">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] bg-[#F8FBFE] border border-[#D7E3F2] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span className="text-xs font-medium text-[#4a607d]">Mã phản hồi 403 • Quyền truy cập</span>
          </div>

          {/* Title & Desc */}
          <h1 className="text-2xl font-bold text-[#021b3d] mb-2 tracking-tight">
            Truy cập bị từ chối
          </h1>
          <p className="text-sm text-[#4a607d] leading-relaxed max-w-sm mb-6">
            Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chính của bạn.
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col items-center gap-3">
            <Button
              className="w-full sm:w-auto min-w-[200px]"
              onClick={() => navigate(homePath)}
            >
              Quay lại trang chính
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm font-medium text-[#4a607d] hover:text-[#021b3d] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
            >
              <span>←</span> Quay lại trang trước
            </button>
          </div>

          {/* Support */}
          <div className="w-full pt-5 mt-6 border-t border-[#D7E3F2] flex items-center justify-center gap-1.5 text-[#4a607d] text-xs">
            <span>Bộ phận hỗ trợ:</span>
            <a href="tel:19006868" className="text-[#0056b3] hover:underline font-semibold">
              1900 6868
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <span className="text-xs text-[#94A3B8]">
            Hệ thống quản lý căn hộ & hợp đồng thuê • Rentify
          </span>
        </div>
      </div>
    </main>
  );
};

export default ForbiddenPage;


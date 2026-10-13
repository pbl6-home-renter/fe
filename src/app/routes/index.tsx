import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { AuthLayout, DashboardLayout } from '@/app/layouts';
import { ForbiddenPage } from '@/app/pages/forbidden-page';
import { NotFoundPage } from '@/app/pages/not-found-page';

import { DashboardOverview } from '@/app/pages/dashboard-overview';

export const routes: RouteObject[] = [
  // 1. Auth Flow (Public Routes with AuthLayout)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <div className="bg-[var(--color-rentify-surface,#FFFFFF)] rounded-2xl p-6 sm:p-8 border border-[var(--color-rentify-divider,#D7E3F2)] shadow-sm text-center">
                <h2 className="text-2xl font-bold text-[var(--color-rentify-text-primary,#142A4C)] mb-2">
                  Đăng nhập Rentify
                </h2>
                <p className="text-sm text-[var(--color-rentify-text-secondary,#5C7290)] mb-6">
                  Vui lòng đăng nhập để tiếp tục quản lý căn hộ
                </p>
                <div className="p-4 rounded-xl bg-[var(--color-rentify-background,#F8FBFE)] border border-[var(--color-rentify-divider,#D7E3F2)] text-xs text-[var(--color-rentify-text-secondary,#5C7290)]">
                  Form đăng nhập đang được đồng bộ
                </div>
              </div>
            ),
          },
          {
            path: '/register',
            element: (
              <div className="bg-[var(--color-rentify-surface,#FFFFFF)] rounded-2xl p-6 sm:p-8 border border-[var(--color-rentify-divider,#D7E3F2)] shadow-sm text-center">
                <h2 className="text-2xl font-bold text-[var(--color-rentify-text-primary,#142A4C)] mb-2">
                  Đăng ký tài khoản
                </h2>
                <p className="text-sm text-[var(--color-rentify-text-secondary,#5C7290)] mb-6">
                  Tạo tài khoản mới cho chủ nhà hoặc khách thuê
                </p>
              </div>
            ),
          },
        ],
      },
    ],
  },

  // 2. Protected App Flow (DashboardLayout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Tenant portal
          {
            path: '/tenant',
            element: (
              <ProtectedRoute allowedRoles={['tenant']}>
                <DashboardOverview
                  title="Tổng quan phòng thuê"
                  desc="Theo dõi thông tin hợp đồng, hóa đơn và các dịch vụ phòng"
                />
              </ProtectedRoute>
            ),
          },
          {
            path: '/tenant/contracts',
            element: (
              <ProtectedRoute allowedRoles={['tenant']}>
                <DashboardOverview title="Hợp đồng thuê" desc="Chi tiết hợp đồng thuê phòng của bạn" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/tenant/invoices',
            element: (
              <ProtectedRoute allowedRoles={['tenant']}>
                <DashboardOverview title="Hóa đơn tiền phòng" desc="Danh sách hóa đơn tiền nhà và điện nước" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/tenant/issues',
            element: (
              <ProtectedRoute allowedRoles={['tenant']}>
                <DashboardOverview title="Báo cáo sự cố" desc="Gửi yêu cầu sửa chữa cơ sở vật chất" />
              </ProtectedRoute>
            ),
          },

          // Landlord portal
          {
            path: '/landlord',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview
                  title="Tổng quan chủ trọ"
                  desc="Báo cáo doanh thu, tình trạng phòng và tỷ lệ lấp đầy"
                />
              </ProtectedRoute>
            ),
          },
          {
            path: '/landlord/rooms',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview title="Quản lý nhà / phòng" desc="Danh sách bất động sản và phòng trọ đang cho thuê" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/landlord/tenants',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview title="Khách thuê" desc="Quản lý danh sách cư dân và thành viên hợp đồng" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/landlord/contracts',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview title="Hợp đồng thuê" desc="Quản lý các hợp đồng thuê nhà điện tử" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/landlord/invoices',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview title="Hóa đơn & Thanh toán" desc="Phát hành và theo dõi đối soát hóa đơn" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/landlord/issues',
            element: (
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <DashboardOverview title="Xử lý sự cố" desc="Theo dõi và phân công xử lý yêu cầu sửa chữa" />
              </ProtectedRoute>
            ),
          },

          // Admin portal
          {
            path: '/admin',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardOverview
                  title="Thống kê hệ thống"
                  desc="Báo cáo toàn diện nền tảng Rentify"
                />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/approvals',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardOverview title="Duyệt chủ trọ" desc="Hàng đợi phê duyệt hồ sơ chủ nhà và bất động sản" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/users',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardOverview title="Quản lý tài khoản" desc="Danh sách và trạng thái người dùng toàn hệ thống" />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/settings',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardOverview title="Cài đặt hệ thống" desc="Cấu hình tham số và chính sách nền tảng" />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // 3. Root redirect
  {
    path: '/',
    element: <Navigate to="/tenant" replace />,
  },
  {
    path: '/dashboard',
    element: <Navigate to="/tenant" replace />,
  },

  // 4. Error Pages
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '/forbidden',
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);

export default router;

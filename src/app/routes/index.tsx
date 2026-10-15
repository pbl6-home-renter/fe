import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { AuthLayout, DashboardLayout } from '@/app/layouts';
import { ForbiddenPage } from '@/app/pages/forbidden-page';
import { NotFoundPage } from '@/app/pages/not-found-page';

import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { RoleBasedRedirect } from './role-based-redirect';
import { Role } from '@/types/role';

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
              <div className="bg-rentify-surface rounded-2xl p-6 sm:p-8 border border-rentify-divider shadow-sm text-center">
                <h2 className="text-2xl font-bold text-rentify-text-primary mb-2">
                  Đăng nhập Rentify
                </h2>
                <p className="text-sm text-rentify-text-secondary mb-6">
                  Vui lòng đăng nhập để tiếp tục quản lý căn hộ
                </p>
                <div className="p-4 rounded-xl bg-rentify-background border border-rentify-divider text-xs text-rentify-text-secondary">
                  Form đăng nhập đang được đồng bộ
                </div>
              </div>
            ),
          },
          {
            path: '/register',
            element: (
              <div className="bg-rentify-surface rounded-2xl p-6 sm:p-8 border border-rentify-divider shadow-sm text-center">
                <h2 className="text-2xl font-bold text-rentify-text-primary mb-2">
                  Đăng ký tài khoản
                </h2>
                <p className="text-sm text-rentify-text-secondary mb-6">
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
          // 2.1 Shared App Flow (Domain-based routes adaptive to user role)
          {
            path: '/dashboard',
            element: (
              <DashboardOverview
                roleConfig={{
                  landlord: {
                    title: 'Tổng quan chủ trọ',
                    desc: 'Báo cáo doanh thu, tình trạng phòng và tỷ lệ lấp đầy',
                  },
                  tenant: {
                    title: 'Tổng quan phòng thuê',
                    desc: 'Theo dõi thông tin hợp đồng, hóa đơn và các dịch vụ phòng',
                  },
                  admin: {
                    title: 'Thống kê hệ thống',
                    desc: 'Báo cáo toàn diện nền tảng Rentify',
                  },
                }}
              />
            ),
          },
          {
            path: '/rooms',
            element: (
              <DashboardOverview
                roleConfig={{
                  landlord: {
                    title: 'Quản lý nhà / phòng',
                    desc: 'Danh sách bất động sản và phòng trọ đang cho thuê',
                  },
                  tenant: {
                    title: 'Phòng của tôi',
                    desc: 'Thông tin chi tiết phòng trọ và tiện ích đang thuê',
                  },
                }}
              />
            ),
          },
          {
            path: '/contracts',
            element: (
              <DashboardOverview
                roleConfig={{
                  landlord: {
                    title: 'Quản lý hợp đồng',
                    desc: 'Quản lý và tạo mới các hợp đồng thuê nhà điện tử',
                  },
                  tenant: {
                    title: 'Hợp đồng thuê',
                    desc: 'Chi tiết hợp đồng thuê phòng của bạn',
                  },
                }}
              />
            ),
          },
          {
            path: '/invoices',
            element: (
              <DashboardOverview
                roleConfig={{
                  landlord: {
                    title: 'Hóa đơn & Thanh toán',
                    desc: 'Phát hành và theo dõi đối soát hóa đơn các phòng',
                  },
                  tenant: {
                    title: 'Hóa đơn tiền phòng',
                    desc: 'Danh sách hóa đơn tiền nhà, điện nước và thanh toán VietQR',
                  },
                }}
              />
            ),
          },
          {
            path: '/issues',
            element: (
              <DashboardOverview
                roleConfig={{
                  landlord: {
                    title: 'Xử lý sự cố',
                    desc: 'Theo dõi và phân công xử lý yêu cầu sửa chữa cơ sở vật chất',
                  },
                  tenant: {
                    title: 'Báo cáo sự cố',
                    desc: 'Gửi yêu cầu sửa chữa và theo dõi tiến độ xử lý',
                  },
                }}
              />
            ),
          },
          {
            path: '/tenants',
            element: (
              <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
                <DashboardOverview
                  title="Quản lý khách thuê"
                  desc="Quản lý danh sách cư dân và thành viên hợp đồng"
                />
              </ProtectedRoute>
            ),
          },

          // 2.2 Admin Portal (Exclusive to Admin)
          {
            path: '/admin',
            element: (
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
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
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <DashboardOverview
                  title="Duyệt chủ trọ"
                  desc="Hàng đợi phê duyệt hồ sơ chủ nhà và bất động sản"
                />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/users',
            element: (
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <DashboardOverview
                  title="Quản lý tài khoản"
                  desc="Danh sách và trạng thái người dùng toàn hệ thống"
                />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/settings',
            element: (
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <DashboardOverview
                  title="Cài đặt hệ thống"
                  desc="Cấu hình tham số và chính sách nền tảng"
                />
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
    element: <RoleBasedRedirect />,
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


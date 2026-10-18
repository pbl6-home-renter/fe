import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';
import { RoleBasedRedirect } from './role-based-redirect';
import { authRoutes } from './roles/auth.routes';
import { commonRoutes } from './roles/common.routes';
import { landlordRoutes } from './roles/landlord.routes';
import { tenantRoutes } from './roles/tenant.routes';
import { adminRoutes } from './roles/admin.routes';
import { errorRoutes } from './roles/error.routes';

export const routes: RouteObject[] = [
  // 1. Auth Flow (Public Routes with AuthLayout)
  ...authRoutes,

  // 2. Protected App Flow (DashboardLayout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          ...commonRoutes,
          ...landlordRoutes,
          ...tenantRoutes,
          ...adminRoutes,
        ],
      },
    ],
  },

  // 3. Root redirect
  {
    path: '/',
    element: <RoleBasedRedirect />,
  },

  // 4. Error Pages & Fallbacks
  ...errorRoutes,
];

export const router = createBrowserRouter(routes);

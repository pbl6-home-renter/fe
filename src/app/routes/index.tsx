import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { ProtectedRoute } from './protected-route';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';
import { AppRouterLayout } from '@/app/layouts/app-router-layout';
import { RoleBasedRedirect } from './role-based-redirect';
import { RoomSearchDispatcher } from './room-search-dispatcher';
import { RoomDetailDispatcher } from './room-detail-dispatcher';
import { RoommatesDispatcher } from './roommates-dispatcher';
import { authRoutes } from './roles/auth.routes';
import { commonRoutes } from './roles/common.routes';
import { landlordRoutes } from './roles/landlord.routes';
import { tenantRoutes } from './roles/tenant.routes';
import { adminRoutes } from './roles/admin.routes';
import { errorRoutes } from './roles/error.routes';
import { NotificationsPage } from '@/features/notifications/pages/notifications-page';

export const routes: RouteObject[] = [
  {
    element: <AppRouterLayout />,
    children: [
      ...authRoutes,
      {
        element: <ProtectedRoute allowLocked />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> }],
          },
        ],
      },
      {
        path: ROUTES.ROOMS_SEARCH,
        element: <RoomSearchDispatcher />,
      },
      {
        path: ROUTES.ROOM_DETAIL(':id'),
        element: <RoomDetailDispatcher />,
      },
      {
        path: ROUTES.ROOMMATES,
        element: <RoommatesDispatcher />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [...commonRoutes, ...landlordRoutes, ...tenantRoutes, ...adminRoutes],
          },
        ],
      },
      {
        path: ROUTES.HOME,
        element: <RoleBasedRedirect />,
      },
      ...errorRoutes,
    ],
  },
];

export const router = createBrowserRouter(routes);

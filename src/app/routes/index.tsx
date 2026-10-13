import { useRoutes, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { ForbiddenPage } from '@/app/pages/forbidden-page';
import { NotFoundPage } from '@/app/pages/not-found-page';

export const AppRoutes = () => {
  const routes: RouteObject[] = [
    // Public routes (Auth flow)
    {
      element: <PublicRoute />,
      children: [
        {
          path: '/login',
          element: (
            <div className="flex min-h-screen items-center justify-center">
              <h1 className="text-xl font-bold">Trang đăng nhập</h1>
            </div>
          ),
        },
      ],
    },

    // Protected routes for authenticated users
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/tenant',
          element: (
            <div className="flex min-h-screen items-center justify-center">
              <h1 className="text-xl font-bold">Khu vực người thuê (Tenant)</h1>
            </div>
          ),
        },
        {
          path: '/landlord',
          element: (
            <ProtectedRoute roles={['landlord', 'admin']}>
              <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-xl font-bold">Khu vực chủ nhà (Landlord)</h1>
              </div>
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin',
          element: (
            <ProtectedRoute roles={['admin']}>
              <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-xl font-bold">Khu vực quản trị viên (Admin)</h1>
              </div>
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Root redirect / home
    {
      path: '/',
      element: <Navigate to="/tenant" replace />,
    },

    // 403 Forbidden page
    {
      path: '/403',
      element: <ForbiddenPage />,
    },
    {
      path: '/forbidden',
      element: <ForbiddenPage />,
    },

    // 404 Wildcard route for non-existent paths
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];

  return useRoutes(routes);
};

export default AppRoutes;


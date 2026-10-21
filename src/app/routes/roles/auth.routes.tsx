import type { RouteObject } from 'react-router-dom';
import { PublicRoute } from '../public-route';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';

export const authRoutes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/forgot-password',
            element: <div>Quên mật khẩu</div>,
          },
          {
            path: '/reset-password',
            element: <div>Đặt lại mật khẩu</div>,
          },
        ],
      },
    ],
  },
];

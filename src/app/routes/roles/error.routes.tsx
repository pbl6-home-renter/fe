import type { RouteObject } from 'react-router-dom';
import { ForbiddenPage } from '@/app/pages/forbidden-page';
import { NotFoundPage } from '@/app/pages/not-found-page';

export const errorRoutes: RouteObject[] = [
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


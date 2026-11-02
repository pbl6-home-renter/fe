import type { RouteObject } from 'react-router-dom';
import { ForbiddenPage } from '@/app/pages/forbidden-page';
import { NotFoundPage } from '@/app/pages/not-found-page';
import { ROUTES } from '@/config/routes.config';

export const errorRoutes: RouteObject[] = [
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: ROUTES.FORBIDDEN_ALT,
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];


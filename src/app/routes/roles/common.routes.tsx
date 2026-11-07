import type { RouteObject } from 'react-router-dom';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { DesignSystemShowcasePage } from '@/app/pages/design-system-showcase-page';
import { ROUTES } from '@/config/routes.config';
import { ChatRoute } from '@/app/routes/chat-route';
import { NotificationsPage } from '@/features/notifications/pages/notifications-page';

export const commonRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTES.INVOICES,
    element: (
      <DashboardOverview
        roleConfig={{
          landlord: {
            titleKey: 'routes.invoices.landlordTitle',
            descKey: 'routes.invoices.landlordDesc',
          },
          tenant: {
            titleKey: 'routes.invoices.tenantTitle',
            descKey: 'routes.invoices.tenantDesc',
          },
        }}
      />
    ),
  },
  {
    path: ROUTES.INVOICE_DETAIL(':id'),
    element: <DashboardOverview titleKey="routes.invoices.detailTitle" descKey="routes.invoices.detailDesc" />,
  },
  {
    path: ROUTES.ISSUES,
    element: (
      <DashboardOverview
        roleConfig={{
          landlord: {
            titleKey: 'routes.issues.landlordTitle',
            descKey: 'routes.issues.landlordDesc',
          },
          tenant: {
            titleKey: 'routes.issues.tenantTitle',
            descKey: 'routes.issues.tenantDesc',
          },
        }}
      />
    ),
  },
  {
    path: ROUTES.ISSUE_NEW,
    element: <DashboardOverview titleKey="routes.issues.newTitle" descKey="routes.issues.newDesc" />,
  },
  {
    path: ROUTES.ISSUE_DETAIL(':id'),
    element: <DashboardOverview titleKey="routes.issues.detailTitle" descKey="routes.issues.detailDesc" />,
  },
  {
    path: ROUTES.CHAT,
    element: <ChatRoute />,
  },
  {
    path: ROUTES.CHAT_DETAIL(':id'),
    element: <ChatRoute />,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <DashboardOverview titleKey="routes.profile.title" descKey="routes.profile.desc" />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <DashboardOverview titleKey="routes.settings.title" descKey="routes.settings.desc" />,
  },
  {
    path: ROUTES.DESIGN_SYSTEM,
    element: <DesignSystemShowcasePage />,
  },
];

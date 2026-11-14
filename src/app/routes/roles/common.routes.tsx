import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { DesignSystemShowcasePage } from '@/app/pages/design-system-showcase-page';
import { ROUTES } from '@/config/routes.config';
import { ChatRoute } from '@/app/routes/chat-route';
import { InvoiceDetailRoute, InvoiceListRoute } from '@/app/routes/invoice-route';
import { NotificationsPage } from '@/features/notifications/pages/notifications-page';
import { ProfilePage } from '@/features/users/pages/profile-page';
import { ContractDetailRoute, ContractListRoute } from '@/app/routes/contract-route';
import { SecuritySettingsPage } from '@/features/auth/pages/security-settings-page';
import { RoomListRoute } from '@/app/routes/room-route';
import { IssueCreateRoute, IssueDetailRoute, IssueListRoute } from '@/app/routes/issue-route';

export const commonRoutes: RouteObject[] = [
  { path: ROUTES.TENANT.CONTRACTS, element: <ContractListRoute /> },
  { path: ROUTES.TENANT.CONTRACT_DETAIL(':id'), element: <ContractDetailRoute /> },
  { path: ROUTES.TENANT.ROOMS, element: <RoomListRoute /> },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTES.INVOICES,
    element: <InvoiceListRoute />,
  },
  {
    path: ROUTES.INVOICE_DETAIL(':id'),
    element: <InvoiceDetailRoute />,
  },
  {
    path: ROUTES.ISSUES,
    element: <IssueListRoute />,
  },
  {
    path: ROUTES.ISSUE_NEW,
    element: <IssueCreateRoute />,
  },
  {
    path: ROUTES.ISSUE_DETAIL(':id'),
    element: <IssueDetailRoute />,
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
    element: <ProfilePage />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <SecuritySettingsPage />,
  },
  {
    path: ROUTES.DESIGN_SYSTEM,
    element: <DesignSystemShowcasePage />,
  },
];

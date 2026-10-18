import type { RouteObject } from 'react-router-dom';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { DesignSystemShowcasePage } from '@/app/pages/design-system-showcase-page';

export const commonRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <DashboardOverview
        roleConfig={{
          landlord: {
            titleKey: 'routes.dashboard.landlordTitle',
            descKey: 'routes.dashboard.landlordDesc',
          },
          tenant: {
            titleKey: 'routes.dashboard.tenantTitle',
            descKey: 'routes.dashboard.tenantDesc',
          },
          admin: {
            titleKey: 'routes.dashboard.adminTitle',
            descKey: 'routes.dashboard.adminDesc',
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
            titleKey: 'routes.rooms.landlordTitle',
            descKey: 'routes.rooms.landlordDesc',
          },
          tenant: {
            titleKey: 'routes.rooms.tenantTitle',
            descKey: 'routes.rooms.tenantDesc',
          },
        }}
      />
    ),
  },
  {
    path: '/rooms/:id',
    element: (
      <DashboardOverview
        titleKey="routes.rooms.detailTitle"
        descKey="routes.rooms.detailDesc"
      />
    ),
  },
  {
    path: '/contracts',
    element: (
      <DashboardOverview
        roleConfig={{
          landlord: {
            titleKey: 'routes.contracts.landlordTitle',
            descKey: 'routes.contracts.landlordDesc',
          },
          tenant: {
            titleKey: 'routes.contracts.tenantTitle',
            descKey: 'routes.contracts.tenantDesc',
          },
        }}
      />
    ),
  },
  {
    path: '/contracts/:id',
    element: (
      <DashboardOverview
        titleKey="routes.contracts.detailTitle"
        descKey="routes.contracts.detailDesc"
      />
    ),
  },
  {
    path: '/invoices',
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
    path: '/invoices/:id',
    element: (
      <DashboardOverview
        titleKey="routes.invoices.detailTitle"
        descKey="routes.invoices.detailDesc"
      />
    ),
  },
  {
    path: '/issues',
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
    path: '/issues/new',
    element: (
      <DashboardOverview
        titleKey="routes.issues.newTitle"
        descKey="routes.issues.newDesc"
      />
    ),
  },
  {
    path: '/issues/:id',
    element: (
      <DashboardOverview
        titleKey="routes.issues.detailTitle"
        descKey="routes.issues.detailDesc"
      />
    ),
  },
  {
    path: '/chat',
    element: (
      <DashboardOverview
        titleKey="routes.chat.title"
        descKey="routes.chat.desc"
      />
    ),
  },
  {
    path: '/chat/:id',
    element: (
      <DashboardOverview
        titleKey="routes.chat.detailTitle"
        descKey="routes.chat.detailDesc"
      />
    ),
  },
  {
    path: '/notifications',
    element: (
      <DashboardOverview
        titleKey="routes.notifications.title"
        descKey="routes.notifications.desc"
      />
    ),
  },
  {
    path: '/profile',
    element: (
      <DashboardOverview
        titleKey="routes.profile.title"
        descKey="routes.profile.desc"
      />
    ),
  },
  {
    path: '/design-system',
    element: <DesignSystemShowcasePage />,
  },
];

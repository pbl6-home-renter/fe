import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { InvoiceDetailPage } from '@/features/invoices/pages/invoice-detail-page';
import { InvoiceListPage } from '@/features/invoices/pages/invoice-list-page';
import { Role } from '@/types/role';
import { ProtectedRoute } from './protected-route';

export const InvoiceListRoute = () => {
  const { role } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
      {role === Role.LANDLORD ? (
        <InvoiceListPage />
      ) : (
        <DashboardOverview titleKey="routes.invoices.tenantTitle" descKey="routes.invoices.tenantDesc" />
      )}
    </ProtectedRoute>
  );
};

export const InvoiceDetailRoute = () => {
  const { role } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
      {role === Role.LANDLORD ? (
        <InvoiceDetailPage />
      ) : (
        <DashboardOverview titleKey="routes.invoices.detailTitle" descKey="routes.invoices.detailDesc" />
      )}
    </ProtectedRoute>
  );
};

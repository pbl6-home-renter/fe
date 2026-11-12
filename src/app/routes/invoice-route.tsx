import { useAuth } from '@/features/auth/hooks/use-auth';
import { InvoiceDetailPage } from '@/features/invoices/pages/invoice-detail-page';
import { InvoiceListPage } from '@/features/invoices/pages/invoice-list-page';
import { TenantInvoiceDetailPage } from '@/features/invoices/pages/tenant/tenant-invoice-detail-page';
import { TenantInvoiceListPage } from '@/features/invoices/pages/tenant/tenant-invoice-list-page';
import { Role } from '@/types/role';
import { ProtectedRoute } from './protected-route';

export const InvoiceListRoute = () => {
  const { role } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
      {role === Role.LANDLORD ? <InvoiceListPage /> : <TenantInvoiceListPage />}
    </ProtectedRoute>
  );
};

export const InvoiceDetailRoute = () => {
  const { role } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
      {role === Role.LANDLORD ? <InvoiceDetailPage /> : <TenantInvoiceDetailPage />}
    </ProtectedRoute>
  );
};

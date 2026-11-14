import { useAuth } from '@/features/auth/hooks/use-auth';
import { ContractDetailPage } from '@/features/contracts/pages/contract-detail-page';
import { ContractListPage } from '@/features/contracts/pages/contract-list-page';
import { TenantContractDetailPage } from '@/features/contracts/pages/tenant/tenant-contract-detail-page';
import { TenantContractListPage } from '@/features/contracts/pages/tenant/tenant-contract-list-page';
import { Role } from '@/types/role';
import { ProtectedRoute } from './protected-route';

export const ContractListRoute = () => {
  const { role } = useAuth();
  return <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>{role === Role.LANDLORD ? <ContractListPage /> : <TenantContractListPage />}</ProtectedRoute>;
};

export const ContractDetailRoute = () => {
  const { role } = useAuth();
  return <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>{role === Role.LANDLORD ? <ContractDetailPage /> : <TenantContractDetailPage />}</ProtectedRoute>;
};

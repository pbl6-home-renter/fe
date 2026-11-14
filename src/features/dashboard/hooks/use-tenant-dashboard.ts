import { useTenantActiveContracts } from '@/features/rooms/hooks/use-tenant-active-contracts';

export const useTenantDashboard = () => {
  const { data: contracts, isLoading, isError, refetch } = useTenantActiveContracts();

  const activeCount = contracts?.length ?? 0;

  return {
    contracts,
    activeCount,
    isLoading,
    isError,
    refetch,
  };
};

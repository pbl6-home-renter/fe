import { useState } from 'react';
import { BuildingStatus } from '@/features/buildings/enums/building-status.enum';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { useContractsQuery } from '@/features/contracts/hooks/use-contracts-query';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import { useInvoicesQuery } from '@/features/invoices/hooks/use-invoices-query';
import { useIssuesQuery } from '@/features/issues/hooks/use-issues-query';

export const useLandlordDashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Buildings data
  const all = useMyBuildingsQuery({ pageNo: 1, pageSize: 20 });
  const approved = useMyBuildingsQuery({ filter: { status: BuildingStatus.APPROVED } });
  const pending = useMyBuildingsQuery({ filter: { status: BuildingStatus.PENDING } });

  // Operational streams
  const contractsQuery = useContractsQuery({ pageNo: 1, pageSize: 1, filter: { status: ContractStatus.ACTIVE } });
  const invoicesQuery = useInvoicesQuery({ pageNo: 1, pageSize: 5 });
  const issuesQuery = useIssuesQuery(false, { pageNo: 1, pageSize: 5, filter: { status: 'open' } });

  const isLoading = all.isLoading || approved.isLoading || pending.isLoading;
  const isError = all.isError || approved.isError || pending.isError;

  const refetch = () =>
    Promise.all([
      all.refetch(),
      approved.refetch(),
      pending.refetch(),
      contractsQuery.refetch(),
      invoicesQuery.refetch(),
      issuesQuery.refetch(),
    ]);

  const total = all.data?.pagination.totalItems;
  const active = approved.data?.pagination.totalItems;
  const pendingCount = pending.data?.pagination.totalItems;

  const buildings = all.data?.items ?? [];
  const occupiedRooms = buildings.reduce((acc, b) => acc + (b.occupiedRooms || 0), 0);
  const totalRooms = buildings.reduce((acc, b) => acc + (b.totalRooms || 0), 0);

  const activeContractsCount = contractsQuery.data?.pagination.totalItems ?? 0;
  const totalInvoicesCount = invoicesQuery.data?.pagination.totalItems ?? 0;
  const openIssuesCount = issuesQuery.data?.pagination.totalItems ?? 0;

  const metrics =
    total !== undefined && active !== undefined && pendingCount !== undefined
      ? {
          total,
          active,
          pending: pendingCount,
          others: total >= active + pendingCount ? total - active - pendingCount : null,
          occupiedRooms,
          totalRooms,
          activeContractsCount,
          openIssuesCount,
          totalInvoicesCount,
        }
      : undefined;

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isLoading,
    isError,
    refetch,
    buildings,
    metrics,
    recentInvoices: invoicesQuery.data?.items ?? [],
    recentIssues: issuesQuery.data?.items ?? [],
    isInvoicesLoading: invoicesQuery.isLoading,
    isIssuesLoading: issuesQuery.isLoading,
  };
};

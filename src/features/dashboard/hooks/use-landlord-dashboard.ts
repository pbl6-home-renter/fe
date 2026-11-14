import { useState } from 'react';
import { BuildingStatus } from '@/features/buildings/enums/building-status.enum';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';

export const useLandlordDashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const all = useMyBuildingsQuery({ pageNo: 1, pageSize: 20 });
  const approved = useMyBuildingsQuery({ filter: { status: BuildingStatus.APPROVED } });
  const pending = useMyBuildingsQuery({ filter: { status: BuildingStatus.PENDING } });
  const isLoading = all.isLoading || approved.isLoading || pending.isLoading;
  const isError = all.isError || approved.isError || pending.isError;
  const refetch = () => Promise.all([all.refetch(), approved.refetch(), pending.refetch()]);
  const total = all.data?.pagination.totalItems;
  const active = approved.data?.pagination.totalItems;
  const pendingCount = pending.data?.pagination.totalItems;
  const metrics = total !== undefined && active !== undefined && pendingCount !== undefined
    ? { total, active, pending: pendingCount, others: total >= active + pendingCount ? total - active - pendingCount : null }
    : undefined;
  return { isCreateModalOpen, setIsCreateModalOpen, isLoading, isError, refetch, buildings: all.data?.items, metrics };
};

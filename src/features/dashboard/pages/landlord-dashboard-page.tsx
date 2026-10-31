import { useState } from 'react';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { BuildingCreateModal } from '@/features/buildings/components/building-create-modal';
import { LandlordDashboardEmptyState } from '../components/landlord-dashboard-empty-state';
import { LandlordDashboardFullState } from '../components/landlord-dashboard-full-state';

export const LandlordDashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading, refetch } = useMyBuildingsQuery({ pageNo: 1, pageSize: 20 });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Top Card */}
        <div className="h-44 bg-rentify-surface rounded-hero border border-rentify-divider p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-surface-container-low" />
              <div className="space-y-2">
                <div className="w-48 h-4 bg-surface-container-low rounded" />
                <div className="w-64 h-3 bg-surface-container-low rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-32 h-10 bg-surface-container-low rounded-xl" />
              <div className="w-32 h-10 bg-surface-container-low rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-rentify-divider">
            <div className="h-16 bg-surface-container-low rounded-xl" />
            <div className="h-16 bg-surface-container-low rounded-xl" />
            <div className="h-16 bg-surface-container-low rounded-xl" />
          </div>
        </div>

        {/* Skeleton 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-rentify-surface rounded-2xl border border-rentify-divider" />
          <div className="lg:col-span-5 h-96 bg-rentify-surface rounded-2xl border border-rentify-divider" />
        </div>
      </div>
    );
  }

  const buildings = data?.items || [];

  return (
    <>
      {buildings.length === 0 ? (
        <LandlordDashboardEmptyState onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      ) : (
        <LandlordDashboardFullState
          buildings={buildings}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </>
  );
};

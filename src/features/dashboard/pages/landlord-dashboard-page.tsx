import { useState } from 'react';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { BuildingCreateModal } from '@/features/buildings/components/building-create-modal';
import { LandlordDashboardEmptyState } from '../components/landlord-dashboard-empty-state';
import { LandlordDashboardFullState } from '../components/landlord-dashboard-full-state';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';

export const LandlordDashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading, refetch } = useMyBuildingsQuery({ pageNo: 1, pageSize: 20 });

  if (isLoading) {
    return (
      <div className="space-y-6" role="status">
        <Card className="flex h-44 flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-rentify-divider">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7">
            <Skeleton className="h-80 w-full" />
          </Card>
          <Card className="lg:col-span-5">
            <Skeleton className="h-80 w-full" />
          </Card>
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
        <LandlordDashboardFullState buildings={buildings} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      )}

      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </>
  );
};

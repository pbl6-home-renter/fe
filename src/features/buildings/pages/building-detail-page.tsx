import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { isAxiosError } from 'axios';
import { Card } from '@/components/ui/card';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { BuildingStatus } from '../enums/building-status.enum';
import { BuildingDetailHeader } from '../components/building-detail-header';
import { BuildingOverviewCard } from '../components/building-overview-card';
import { BuildingRatePoliciesCard } from '../components/building-rate-policies-card';
import { BuildingDocumentsCard } from '../components/building-documents-card';
import { BuildingRoomsNavCard } from '../components/building-rooms-nav-card';
import { BuildingAmenitiesCard } from '../components/building-amenities-card';
import { DeleteBuildingDialog } from '../components/delete-building-dialog';
import { BuildingEditModal } from '../components/building-edit-modal';
import { useMyBuildingQuery } from '../hooks/use-my-building-query';

export const BuildingDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: building, isLoading, isError, error, refetch } = useMyBuildingQuery(id);
  const errorStatus = isAxiosError(error) ? error.response?.status : undefined;

  useEffect(() => {
    if (errorStatus === 403) {
      navigate('/forbidden', { replace: true });
    }
  }, [errorStatus, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-8 h-96 rounded-2xl" />
          <Skeleton className="lg:col-span-4 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !building) {
    if (errorStatus === 404) {
      return (
        <Card className="my-8 p-8 border-rentify-divider rounded-2xl">
          <ErrorState
            title={t('detail.notFoundTitle')}
            message={t('detail.notFoundDesc')}
            retryText={t('backToList')}
            onRetry={() => navigate('/buildings')}
          />
        </Card>
      );
    }

    return (
      <Card className="my-8 p-8 border-rentify-divider rounded-2xl">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    );
  }

  const isRejected = building.status === BuildingStatus.REJECTED;

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/buildings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rentify-text-secondary hover:text-rentify-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToList')}</span>
        </button>
      </div>

      <BuildingDetailHeader
        building={building}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      {isRejected && (
        <AlertBanner
          variant="error"
          title={t('detail.rejectedTitle')}
        >
          <div className="flex items-start gap-2 mt-1 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>{building.reviewNote || t('detail.rejectedDefaultReason')}</p>
          </div>
        </AlertBanner>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <BuildingOverviewCard building={building} />
          <BuildingRatePoliciesCard ratePolicies={building.ratePolicies} />
          <BuildingDocumentsCard certificateUrls={building.ownershipCertificateUrls} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <BuildingRoomsNavCard buildingId={building.id} />
          <BuildingAmenitiesCard amenities={building.amenities} />
        </div>
      </div>

      <BuildingEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        building={building}
        onSuccess={() => void refetch()}
      />

      <DeleteBuildingDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        buildingId={building.id}
        buildingName={building.name}
      />
    </div>
  );
};

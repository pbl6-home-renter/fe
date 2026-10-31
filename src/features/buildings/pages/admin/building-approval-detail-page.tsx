import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layers, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { ApprovalDetailHeader } from '../../components/admin/approval-detail-header';
import { RejectBuildingDialog } from '../../components/admin/reject-building-dialog';
import { ApprovalDocumentsCard } from '../../components/admin/approval-documents-card';
import { ApprovalSpecsCard } from '../../components/admin/approval-specs-card';
import { useAdminBuildingQuery } from '../../hooks/admin/use-admin-building-query';
import { useApproveBuildingMutation } from '../../hooks/admin/use-approve-building-mutation';
import { BuildingStatus } from '../../enums/building-status.enum';

export const BuildingApprovalDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t } = useTranslation('buildings');

  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { data: building, isLoading, isError, refetch } = useAdminBuildingQuery(id);
  const approveMutation = useApproveBuildingMutation();

  const isRejected = building?.status === BuildingStatus.REJECTED;

  const handleApprove = () => {
    if (!id || approveMutation.isPending) return;
    approveMutation.mutate(
      {
        id,
        payload: {
          note: t('admin.defaultApproveNote', { defaultValue: 'Đã xác thực hồ sơ và giấy tờ sở hữu' }),
        },
      },
      {
        onSuccess: () => void refetch(),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !building) {
    return (
      <div className="p-6">
        <ErrorState
          title={t('emptyState.title', { defaultValue: 'Không tìm thấy hồ sơ' })}
          message={t('emptyState.description', { defaultValue: 'Hồ sơ bất động sản không tồn tại hoặc đã bị gỡ bỏ.' })}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <ApprovalDetailHeader
        building={building}
        isApproving={approveMutation.isPending}
        onApprove={handleApprove}
        onOpenReject={() => setIsRejectOpen(true)}
      />

      {isRejected && building.reviewNote && (
        <Card className="p-4 border-rentify-error/30 bg-rentify-error/5 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rentify-error shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-rentify-error">
              {t('admin.rejectedNoticeTitle', { defaultValue: 'Hồ sơ đã bị từ chối' })}
            </h4>
            <p className="text-xs text-rentify-text-primary leading-relaxed">
              {building.reviewNote}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <ApprovalSpecsCard building={building} />

          {building.amenities && Object.keys(building.amenities).length > 0 && (
            <Card className="p-6 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-3">
              <h3 className="text-base font-bold text-rentify-text-primary pb-2 border-b border-rentify-divider flex items-center gap-2">
                <Layers className="w-4 h-4 text-rentify-primary" />
                <span>{t('admin.amenitiesTitle', { defaultValue: 'Tiện ích chung đã khai báo' })}</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {Object.entries(building.amenities).map(([key, val]) =>
                  val ? (
                    <span
                      key={key}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low text-rentify-text-primary text-xs font-medium"
                    >
                      {t(`amenities.${key}`, { defaultValue: key })}
                    </span>
                  ) : null
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ApprovalDocumentsCard documents={building.ownershipDocuments || []} />
        </div>
      </div>

      <RejectBuildingDialog
        open={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        buildingId={building.id}
        buildingName={building.name}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};

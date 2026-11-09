import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useRatePoliciesQuery } from '@/features/billing/hooks/use-rate-policies-query';
import { useBillingSettingsQuery } from '@/features/billing/hooks/use-billing-settings-query';
import { useDeactivateRatePolicyMutation } from '@/features/billing/hooks/use-deactivate-rate-policy-mutation';
import { RatePolicyCard } from '@/features/billing/components/rate-policy-card';
import { RatePolicyDialog } from '@/features/billing/components/rate-policy-dialog';
import { BillingSettingCard } from '@/features/billing/components/billing-setting-card';
import { BillingSettingDialog } from '@/features/billing/components/billing-setting-dialog';
import { useRoomQuery } from '../hooks/use-room-query';
import { useMarkRoomReadyMutation } from '../hooks/use-mark-room-ready-mutation';
import { RoomHeader } from '../components/detail/room-header';
import { RoomSpecsCard } from '../components/detail/room-specs-card';
import { RoomTenantContractCard } from '../components/detail/room-tenant-contract-card';
import { RoomMeterReadingsCard } from '../components/detail/room-meter-readings-card';
import { RoomEditModal } from '../components/room-edit-modal';
import { DeleteRoomDialog } from '../components/delete-room-dialog';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';

export const RoomDetailPage = () => {
  const { id: routeBuildingId, roomId: routeRoomId } = useParams<{
    id?: string;
    roomId?: string;
  }>();
  // Support both /rooms/:roomId and /buildings/:id/rooms/:roomId
  const roomId = routeRoomId || routeBuildingId;

  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const rateDialog = useDisclosure();
  const billingDialog = useDisclosure();

  const { data: room, isLoading, isError, refetch } = useRoomQuery(roomId);
  const markReadyMutation = useMarkRoomReadyMutation();
  const deactivateRateMutation = useDeactivateRatePolicyMutation();

  const {
    data: ratePoliciesData,
    isLoading: isRateLoading,
    refetch: refetchRate,
  } = useRatePoliciesQuery(room?.id ? { 'filter[scope]': 'room', 'filter[roomId]': room.id } : undefined, {
    enabled: Boolean(room?.id),
  });

  const {
    data: billingSettingsData,
    isLoading: isBillingLoading,
    refetch: refetchBilling,
  } = useBillingSettingsQuery(room?.id ? { 'filter[scope]': 'room', 'filter[roomId]': room.id } : undefined, {
    enabled: Boolean(room?.id),
  });

  const activeRatePolicy = ratePoliciesData?.items?.[0] ?? null;
  const activeBillingSetting = billingSettingsData?.items?.[0] ?? null;

  const handleDeactivateRate = () => {
    if (!activeRatePolicy?.id || deactivateRateMutation.isPending) return;
    deactivateRateMutation.mutate(activeRatePolicy.id, {
      onSuccess: () => void refetchRate(),
    });
  };

  const handleMarkReady = () => {
    if (!roomId || markReadyMutation.isPending) return;
    markReadyMutation.mutate(roomId, {
      onSuccess: () => void refetch(),
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="p-6">
        <ErrorState
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundDesc')}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <RoomHeader
        room={room}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        onMarkReady={handleMarkReady}
        isMarkingReady={markReadyMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specs & Amenities, Rate Policy & Billing Settings */}
        <div className="lg:col-span-7 space-y-6">
          <RoomSpecsCard room={room} />
          <RatePolicyCard
            scope="room"
            policy={activeRatePolicy}
            isLoading={isRateLoading}
            onConfigure={rateDialog.open}
            onDeactivate={handleDeactivateRate}
            isDeactivating={deactivateRateMutation.isPending}
          />
          <BillingSettingCard
            scope="room"
            setting={activeBillingSetting}
            isLoading={isBillingLoading}
            onConfigure={billingDialog.open}
          />
        </div>

        {/* Right Column: Contract & Tenant info + Meter readings */}
        <div className="lg:col-span-5 space-y-6">
          <RoomTenantContractCard contract={room.currentContract} members={room.currentMembers} />
          <RoomMeterReadingsCard meterReadings={room.latestMeterReadings} buildingId={room.buildingId} />
        </div>
      </div>

      <RoomEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        room={room}
        onSuccess={() => void refetch()}
      />

      <DeleteRoomDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        roomId={room.id}
        roomName={room.name}
        onSuccess={() => {
          navigate(ROUTES.LANDLORD.BUILDING_DETAIL(room.buildingId), { replace: true });
        }}
      />

      <RatePolicyDialog
        open={rateDialog.isOpen}
        onClose={rateDialog.close}
        scope="room"
        buildingId={room.buildingId}
        roomId={room.id}
        existingPolicy={activeRatePolicy}
        onSuccess={() => void refetchRate()}
      />

      <BillingSettingDialog
        open={billingDialog.isOpen}
        onClose={billingDialog.close}
        scope="room"
        buildingId={room.buildingId}
        roomId={room.id}
        existingSetting={activeBillingSetting}
        onSuccess={() => void refetchBilling()}
      />
    </div>
  );
};

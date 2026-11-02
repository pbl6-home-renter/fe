import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import type { SelectOption } from '@/components/ui/select-dropdown';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { useMyRoomsQuery } from '@/features/rooms/hooks/use-my-rooms-query';
import { RoomStatus } from '@/features/rooms/enums/room-status.enum';
import { formatVnd } from '@/lib/utils/format';
import type { ContractCreateFormData } from '../forms/contract.schema';

export const useContractCreateRoomOptions = (form: UseFormReturn<ContractCreateFormData>) => {
  const { t } = useTranslation('contracts');
  const { watch, setValue } = form;

  const selectedBuildingId = watch('buildingId');
  const selectedRoomId = watch('roomId');

  const buildingsQuery = useMyBuildingsQuery({ pageSize: 100 });
  const roomsQuery = useMyRoomsQuery(
    {
      filter: {
        buildingId: selectedBuildingId,
        status: RoomStatus.AVAILABLE,
      },
      pageSize: 100,
    },
    Boolean(selectedBuildingId)
  );

  const availableRooms = useMemo(
    () => roomsQuery.data?.items ?? [],
    [roomsQuery.data?.items]
  );

  useEffect(() => {
    if (selectedRoomId) {
      const room = availableRooms.find((r) => r.id === selectedRoomId);
      if (room?.rentPrice) {
        const currentRent = form.getValues('rentPrice');
        if (!currentRent || currentRent === 0) {
          setValue('rentPrice', room.rentPrice, { shouldValidate: true });
          setValue('depositAmount', room.rentPrice, { shouldValidate: true });
        }
      }
    }
  }, [selectedRoomId, availableRooms, form, setValue]);

  const buildingOptions: SelectOption[] = useMemo(
    () =>
      (buildingsQuery.data?.items ?? []).map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [buildingsQuery.data?.items]
  );

  const roomOptions: SelectOption[] = useMemo(
    () =>
      availableRooms.map((r) => ({
        value: r.id,
        label: `${r.name} (${formatVnd(r.rentPrice)} ${t('detail.perMonth')})`,
      })),
    [availableRooms, t]
  );

  return {
    selectedBuildingId,
    selectedRoomId,
    buildingOptions,
    roomOptions,
    availableRooms,
    isLoadingBuildings: buildingsQuery.isLoading,
    isLoadingRooms: roomsQuery.isLoading,
  };
};

import { useState, useMemo } from 'react';
import { useMyRoomsQuery } from './use-my-rooms-query';
import { BuildingStatus } from '@/features/buildings/enums/building-status.enum';
import { RoomStatus } from '../enums/room-status.enum';
import type { RoomMyListItemDto } from '../types/room.dto';

interface UseBuildingRoomListOptions {
  buildingId: string;
  buildingStatus?: BuildingStatus;
}

export const useBuildingRoomList = ({
  buildingId,
  buildingStatus,
}: UseBuildingRoomListOptions) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isBuildingApproved = buildingStatus === BuildingStatus.APPROVED;

  const { data, isLoading, isError, refetch } = useMyRoomsQuery(
    {
      filter: {
        buildingId,
        ...(selectedStatus !== 'all' ? { status: selectedStatus } : {}),
      },
      pageSize: 100,
    },
    Boolean(buildingId)
  );

  const allRooms: RoomMyListItemDto[] = useMemo(
    () => data?.items ?? [],
    [data?.items]
  );

  // Extract unique available floors from rooms
  const availableFloors = useMemo(() => {
    const floors = new Set<number>();
    allRooms.forEach((r) => {
      if (r.floorNumber) floors.add(r.floorNumber);
    });
    return Array.from(floors).sort((a, b) => a - b);
  }, [allRooms]);

  // Filter rooms by floor
  const filteredRooms = useMemo(() => {
    if (selectedFloor === 'all') return allRooms;
    return allRooms.filter((r) => r.floorNumber === selectedFloor);
  }, [allRooms, selectedFloor]);

  return {
    rooms: filteredRooms,
    totalRooms: allRooms.length,
    isLoading,
    isError,
    refetch,
    isBuildingApproved,
    selectedFloor,
    setSelectedFloor,
    selectedStatus,
    setSelectedStatus,
    availableFloors,
    isCreateOpen,
    setIsCreateOpen,
  };
};

import { useMemo } from 'react';
import { useMyRoomsQuery } from '@/features/rooms/hooks/use-my-rooms-query';

export const useBuildingFloors = (buildingId?: string, fallbackFloors?: number | null): number | null => {
  const { data: roomsData } = useMyRoomsQuery(
    { filter: { buildingId: buildingId ?? '' }, pageSize: 100 },
    Boolean(buildingId),
  );

  return useMemo(() => {
    if (fallbackFloors && fallbackFloors > 0) return fallbackFloors;
    const items = roomsData?.items;
    if (!items || items.length === 0) return null;
    const floors = items.map((r) => r.floorNumber).filter((n): n is number => typeof n === 'number' && n > 0);
    return floors.length > 0 ? Math.max(...floors) : null;
  }, [fallbackFloors, roomsData?.items]);
};

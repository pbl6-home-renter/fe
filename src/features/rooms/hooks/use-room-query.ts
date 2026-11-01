import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomDetailDto } from '../types/room.dto';

export const useRoomQuery = (id?: string) =>
  useQuery<RoomDetailDto>({
    queryKey: ROOM_QUERY_KEYS.DETAIL(id),
    queryFn: () => {
      if (!id) throw new Error('Room ID is required');
      return roomApi.getRoom(id);
    },
    enabled: Boolean(id),
  });

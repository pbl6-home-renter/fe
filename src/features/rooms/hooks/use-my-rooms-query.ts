import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomFilter, RoomMyListItemDto } from '../types/room.dto';

export const useMyRoomsQuery = (params?: ListParams<RoomFilter>, enabled = true) =>
  useQuery<Paginated<RoomMyListItemDto>>({
    queryKey: ROOM_QUERY_KEYS.MY_LIST(params),
    queryFn: () => roomApi.getMyRooms(params),
    placeholderData: keepPreviousData,
    enabled,
  });

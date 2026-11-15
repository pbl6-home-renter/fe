import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomPublicFilter, RoomPublicListItemDto } from '../types/room.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const usePublicRoomsQuery = (
  params?: ListParams<RoomPublicFilter>,
  options?: QueryHookOptions<Paginated<RoomPublicListItemDto>>,
) =>
  useQuery({
    queryKey: ROOM_QUERY_KEYS.PUBLIC_LIST(params),
    queryFn: () => roomApi.getPublicRooms(params),
    placeholderData: keepPreviousData,
    ...options,
  });

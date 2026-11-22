import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomHubItemDto } from '../types/room.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const useRoomHubQuery = (params?: ListParams, options?: QueryHookOptions<Paginated<RoomHubItemDto>>) =>
  useQuery({
    queryKey: ROOM_QUERY_KEYS.ROOM_HUB_LIST(params),
    queryFn: () => roomApi.getRoomHub(params),
    placeholderData: keepPreviousData,
    ...options,
  });

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomPublicListItemDto } from '../types/room.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const useFavoriteRoomsQuery = (
  params?: ListParams,
  options?: QueryHookOptions<Paginated<RoomPublicListItemDto>>,
) =>
  useQuery({
    queryKey: ROOM_QUERY_KEYS.FAVORITE_LIST(params),
    queryFn: () => roomApi.getFavoriteRooms(params),
    placeholderData: keepPreviousData,
    ...options,
  });

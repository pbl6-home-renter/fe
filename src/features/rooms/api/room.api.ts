import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  FavoriteRoomToggleResponseDto,
  RoomCreateRequestDto,
  RoomDetailDto,
  RoomFilter,
  RoomHubItemDto,
  RoomMarkReadyResponseDto,
  RoomMyListItemDto,
  RoomPublicFilter,
  RoomPublicListItemDto,
  RoomUpdateRequestDto,
} from '../types/room.dto';

export const roomApi = {
  getPublicRooms: (params?: ListParams<RoomPublicFilter>): Promise<Paginated<RoomPublicListItemDto>> =>
    http.getPage<RoomPublicListItemDto, RoomPublicFilter>('/rooms', params),

  getFavoriteRooms: (params?: ListParams): Promise<Paginated<RoomPublicListItemDto>> =>
    http.getPage<RoomPublicListItemDto>('/me/favorite-rooms', params),

  getRoomHub: (params?: ListParams): Promise<Paginated<RoomHubItemDto>> =>
    http.getPage<RoomHubItemDto>('/me/room-hub', params),

  addFavoriteRoom: (roomId: string): Promise<FavoriteRoomToggleResponseDto> =>
    http.post<FavoriteRoomToggleResponseDto>(
      '/me/favorite-rooms',
      { roomId },
      { skipErrorToast: true, skipSuccessToast: true },
    ),

  removeFavoriteRoom: (roomId: string): Promise<void> =>
    http.delete(`/me/favorite-rooms/${roomId}`, { skipErrorToast: true, skipSuccessToast: true }),

  getMyRooms: (params?: ListParams<RoomFilter>): Promise<Paginated<RoomMyListItemDto>> =>
    http.getPage<RoomMyListItemDto, RoomFilter>('/me/rooms', params),

  getRoom: (id: string): Promise<RoomDetailDto> => http.get<RoomDetailDto>(`/rooms/${id}`),

  createRoom: (payload: RoomCreateRequestDto): Promise<RoomDetailDto> => http.post<RoomDetailDto>('/rooms', payload),

  updateRoom: (id: string, payload: RoomUpdateRequestDto): Promise<RoomDetailDto> =>
    http.patch<RoomDetailDto>(`/rooms/${id}`, payload),

  deleteRoom: (id: string): Promise<void> => http.delete(`/rooms/${id}`),

  markRoomReady: (id: string): Promise<RoomMarkReadyResponseDto> =>
    http.post<RoomMarkReadyResponseDto>(`/rooms/${id}/mark-ready`),
};

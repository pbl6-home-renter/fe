import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  RoomCreateRequestDto,
  RoomDetailDto,
  RoomFilter,
  RoomMarkReadyResponseDto,
  RoomMyListItemDto,
  RoomUpdateRequestDto,
} from '../types/room.dto';

export const roomApi = {
  getMyRooms: (params?: ListParams<RoomFilter>): Promise<Paginated<RoomMyListItemDto>> =>
    http.getPage<RoomMyListItemDto, RoomFilter>('/me/rooms', params),

  getRoom: (id: string): Promise<RoomDetailDto> =>
    http.get<RoomDetailDto>(`/rooms/${id}`),

  createRoom: (payload: RoomCreateRequestDto): Promise<RoomDetailDto> =>
    http.post<RoomDetailDto>('/rooms', payload),

  updateRoom: (id: string, payload: RoomUpdateRequestDto): Promise<RoomDetailDto> =>
    http.patch<RoomDetailDto>(`/rooms/${id}`, payload),

  deleteRoom: (id: string): Promise<void> =>
    http.delete(`/rooms/${id}`),

  markRoomReady: (id: string): Promise<RoomMarkReadyResponseDto> =>
    http.post<RoomMarkReadyResponseDto>(`/rooms/${id}/mark-ready`),
};

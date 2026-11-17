import axios from 'axios';
import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  MatchRequestDto,
  MatchRequestListFilterDto,
  MyRoommateProfileDto,
  PublicRoommateProfileDto,
  RoommateProfileSaveRequestDto,
  RoommateProfileSearchFilterDto,
} from '../types/roommate.dto';

export const roommateApi = {
  getMyProfile: async (): Promise<MyRoommateProfileDto | null> => {
    try {
      return await http.get<MyRoommateProfileDto>('/me/roommate-profile', {
        skipErrorToast: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  saveMyProfile: (payload: RoommateProfileSaveRequestDto): Promise<MyRoommateProfileDto> =>
    http.put<MyRoommateProfileDto>('/me/roommate-profile', payload),

  getRoommateProfiles: (
    params?: ListParams<RoommateProfileSearchFilterDto>,
  ): Promise<Paginated<PublicRoommateProfileDto>> =>
    http.getPage<PublicRoommateProfileDto, RoommateProfileSearchFilterDto>('/roommate-profiles', params),

  getRoommateProfileById: (id: string): Promise<PublicRoommateProfileDto> =>
    http.get<PublicRoommateProfileDto>(`/roommate-profiles/${id}`),

  getMatchRequests: (params?: ListParams<MatchRequestListFilterDto>): Promise<Paginated<MatchRequestDto>> =>
    http.getPage<MatchRequestDto, MatchRequestListFilterDto>('/match-requests', params),

  createMatchRequest: (targetId: string): Promise<MatchRequestDto> =>
    http.post<MatchRequestDto>(
      '/match-requests',
      { targetId },
      {
        headers: {
          'Idempotency-Key': crypto.randomUUID(),
        },
      },
    ),

  acceptMatchRequest: (matchRequestId: string): Promise<MatchRequestDto> =>
    http.post<MatchRequestDto>(`/match-requests/${matchRequestId}/accept-request`),

  rejectMatchRequest: (matchRequestId: string): Promise<MatchRequestDto> =>
    http.post<MatchRequestDto>(`/match-requests/${matchRequestId}/reject-request`),

  withdrawMatchRequest: (matchRequestId: string): Promise<MatchRequestDto> =>
    http.post<MatchRequestDto>(`/match-requests/${matchRequestId}/withdraw-request`),
};

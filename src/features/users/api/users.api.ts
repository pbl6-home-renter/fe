import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import type {
  UserDetailAdminDto,
  UserListAdminItemDto,
  UserListAdminParams,
  UserLockRequestDto,
  UserLockResponseDto,
  UserUnlockResponseDto,
  UserUpdateAdminRequestDto,
  UserUpdateAdminResponseDto,
} from '../types/users.dto';

export const usersApi = {
  getUsersAdmin: (params?: UserListAdminParams): Promise<Paginated<UserListAdminItemDto>> =>
    http.getPageWithParams<UserListAdminItemDto, UserListAdminParams>('/users', params ?? {}),

  getUserDetailAdmin: (userId: string): Promise<UserDetailAdminDto> => http.get<UserDetailAdminDto>(`/users/${userId}`),

  updateUserAdmin: (userId: string, payload: UserUpdateAdminRequestDto): Promise<UserUpdateAdminResponseDto> =>
    http.patch<UserUpdateAdminResponseDto>(`/users/${userId}`, payload),

  lockUser: (userId: string, payload: UserLockRequestDto): Promise<UserLockResponseDto> =>
    http.post<UserLockResponseDto>(`/users/${userId}/lock`, payload),

  unlockUser: (userId: string): Promise<UserUnlockResponseDto> =>
    http.post<UserUnlockResponseDto>(`/users/${userId}/unlock`),

  deleteUser: (userId: string): Promise<void> => http.delete<void>(`/users/${userId}`),
};

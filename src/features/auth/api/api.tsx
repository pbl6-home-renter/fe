import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export interface LoginCredentials {
  phoneOrEmail: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  profile: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponseData> => {
    return apiClient.post<ApiResponse<LoginResponseData>, LoginResponseData>(
      '/auth/login',
      credentials
    );
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get<ApiResponse<User>, User>('/users/me');
  },
};

